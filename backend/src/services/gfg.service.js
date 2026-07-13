import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../config/index.js';
import { registerRefresher } from '../cache/cache.js';
import { extractUsernameFromUrl } from '../utils/helpers.js';

const GFG_BASE = 'https://www.geeksforgeeks.org';

// Last-known-good snapshot, taken directly from the user's own profile page.
// This is ONLY used as a fallback when live scraping fails, and is always
// returned with `stale: true` + `as_of` so the frontend can show it as
// "last synced" data rather than presenting it as a fresh live value.
// Update this whenever you confirm a fresh set of real numbers.
const GFG_LAST_KNOWN_GOOD = {
  coding_score: 188,
  problems_solved: 54,
  institution_rank: 214,
  streak: 0,
  as_of: '2026-07-13',
};

export async function getGFGProfile(username = undefined) {
  let user = username || config.gfgUsername;
  if (user && typeof user === 'string' && user.includes('http')) user = extractUsernameFromUrl(user);
  if (!user) throw Object.assign(new Error('GFG_USERNAME not configured'), { status: 500 });
  const url = `${GFG_BASE}/profile/${user}?tab=activity`;
  try {
    const resp = await axios.get(url, { headers: { 'User-Agent': 'portfolio-backend/1.0 (+https://github.com)' } });
    const publicProfile = parseGFGPublicProfile(resp.data);

    if (!publicProfile) {
      // Real data genuinely could not be found live. Rather than inventing
      // arbitrary numbers (the old bug), fall back to a real last-known-good
      // snapshot and mark it clearly as stale — never presented as fresh live data.
      const debugInfo = debugParseGFG(resp.data, user);
      console.warn(
        `[gfg] Could not parse live profile data for "${user}" — falling back to last-known-good (as_of ${GFG_LAST_KNOWN_GOOD.as_of}).`,
        debugInfo
      );

      return {
        username: user,
        available: false,
        stale: true,
        as_of: GFG_LAST_KNOWN_GOOD.as_of,
        error: 'Could not parse live GFG profile data (page structure may have changed) — showing last-known-good values',
        coding_score: GFG_LAST_KNOWN_GOOD.coding_score,
        problems_solved: GFG_LAST_KNOWN_GOOD.problems_solved,
        institution_rank: GFG_LAST_KNOWN_GOOD.institution_rank,
        streak: GFG_LAST_KNOWN_GOOD.streak,
        heatmap: buildGFGHeatmap({
          problemsSolved: GFG_LAST_KNOWN_GOOD.problems_solved,
          codingScore: GFG_LAST_KNOWN_GOOD.coding_score,
        }),
        recent_activity: [],
      };
    }

    return {
      username: user,
      available: true,
      coding_score: publicProfile.codingScore,
      problems_solved: publicProfile.problemsSolved,
      institution_rank: publicProfile.institutionRank,
      streak: publicProfile.streak,
      heatmap: buildGFGHeatmap({ problemsSolved: publicProfile.problemsSolved, codingScore: publicProfile.codingScore }),
      recent_activity: [],
    };
  } catch (err) {
    // Network errors, timeouts, DNS issues, etc. Same principle: don't let this
    // reject in a way that can cascade-fail a Promise.all with other platforms.
    // A genuine 404 (user doesn't exist) is different from "couldn't fetch" —
    // don't paper over a wrong username with fallback numbers.
    if (err.response && err.response.status === 404) {
      console.warn(`[gfg] User "${user}" not found on GeeksforGeeks.`);
      return {
        username: user,
        available: false,
        stale: false,
        error: 'GeeksforGeeks user not found',
        coding_score: null,
        problems_solved: null,
        institution_rank: null,
        streak: null,
        heatmap: [],
        recent_activity: [],
      };
    }

    console.warn(`[gfg] Failed to fetch profile for "${user}" — falling back to last-known-good:`, err.message);
    return {
      username: user,
      available: false,
      stale: true,
      as_of: GFG_LAST_KNOWN_GOOD.as_of,
      error: err.message || 'Failed to fetch GFG profile',
      coding_score: GFG_LAST_KNOWN_GOOD.coding_score,
      problems_solved: GFG_LAST_KNOWN_GOOD.problems_solved,
      institution_rank: GFG_LAST_KNOWN_GOOD.institution_rank,
      streak: GFG_LAST_KNOWN_GOOD.streak,
      heatmap: buildGFGHeatmap({
        problemsSolved: GFG_LAST_KNOWN_GOOD.problems_solved,
        codingScore: GFG_LAST_KNOWN_GOOD.coding_score,
      }),
      recent_activity: [],
    };
  }
}

/**
 * Diagnostic helper — NOT used in the normal success path. Only runs when live
 * parsing fails, to tell you exactly what the scraper found so the real field
 * names can be fixed instead of guessed at. Safe to leave in permanently;
 * it only does string scanning, no extra network calls.
 */
function debugParseGFG(html, expectedUsername) {
  try {
    const chunks = extractAllNextFChunks(html);
    const combined = chunks.join('\n');

    const keyAnchoredCandidates = [];
    let searchFrom = 0;
    while (true) {
      const obj = extractJsonObjectContainingKey(combined, 'total_problems_solved', searchFrom);
      if (!obj.found) break;
      keyAnchoredCandidates.push(obj.value);
      searchFrom = obj.nextIndex;
    }

    const textProbes = {
      'contains "total_problems_solved"': html.includes('total_problems_solved'),
      'contains "institute_rank"': html.includes('institute_rank'),
      'contains "pod_solved_current_streak"': html.includes('pod_solved_current_streak'),
      'contains "coding_score"': html.includes('coding_score'),
      'contains "userData"': html.includes('userData'),
    };

    return {
      htmlLength: html?.length ?? 0,
      chunkCount: chunks.length,
      textProbes,
      keyAnchoredCandidateCount: keyAnchoredCandidates.length,
      keyAnchoredCandidateKeys: keyAnchoredCandidates.map((c) => Object.keys(c)),
      keyAnchoredCandidateSample: keyAnchoredCandidates[0] ?? null,
      expectedUsername,
    };
  } catch (e) {
    return { debugError: e.message };
  }
}

function parseGFGPublicProfile(html) {
  const chunks = extractAllNextFChunks(html);
  if (!chunks.length) return null;

  // Chunks are wrapped in the React Flight/RSC wire format, which prefixes many
  // pushes with a type marker (e.g. "I[...]", "HL[...]") before the actual data —
  // so JSON.parse on a *whole* chunk often fails even though the object we want
  // is sitting inside it as plain text. Instead of requiring the whole chunk to
  // parse, anchor on the field name we know exists and pull out just its
  // enclosing {...} object.
  const combined = chunks.join('\n');
  const candidates = [];

  // total_problems_solved is the strongest, least ambiguous anchor (score/rank
  // alone could theoretically appear in unrelated widgets).
  let searchFrom = 0;
  while (true) {
    const obj = extractJsonObjectContainingKey(combined, 'total_problems_solved', searchFrom);
    if (!obj.found) break;
    candidates.push(obj.value);
    searchFrom = obj.nextIndex;
  }

  if (!candidates.length) return null;

  const scored = candidates
    .map((data) => ({ data, score: scoreCandidate(data) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;
  const best = scored[0].data;

  const codingScore = safeNumber(best.score ?? best.coding_score);
  const problemsSolved = safeNumber(best.total_problems_solved);

  if (codingScore === null || problemsSolved === null) return null;

  return {
    codingScore,
    problemsSolved,
    institutionRank: safeNumber(best.institute_rank),
    streak: safeNumber(best.pod_solved_current_streak),
  };
}

/**
 * Finds the next occurrence of `"key"` in `text` after `fromIndex`, then walks
 * outward to find its smallest enclosing JSON object and parses just that
 * substring — without needing the surrounding text to be valid JSON at all.
 * String-aware (won't miscount braces that appear inside quoted string values).
 */
function extractJsonObjectContainingKey(text, key, fromIndex = 0) {
  const needle = `"${key}"`;
  const keyIndex = text.indexOf(needle, fromIndex);
  if (keyIndex === -1) return { found: false };

  const start = findEnclosingBraceStart(text, keyIndex);
  if (start === -1) return { found: false, nextIndex: keyIndex + needle.length };

  const end = findMatchingBraceEnd(text, start);
  if (end === -1) return { found: false, nextIndex: keyIndex + needle.length };

  const candidate = text.slice(start, end + 1);
  try {
    return { found: true, value: JSON.parse(candidate), nextIndex: end + 1 };
  } catch {
    return { found: false, nextIndex: keyIndex + needle.length };
  }
}

/** Walk backward from `fromIndex` to the nearest unmatched "{" that encloses it. */
function findEnclosingBraceStart(text, fromIndex) {
  let depth = 0;
  for (let i = fromIndex; i >= 0; i--) {
    const ch = text[i];
    if (ch === '}') depth++;
    else if (ch === '{') {
      if (depth === 0) return i;
      depth--;
    }
  }
  return -1;
}

/** Walk forward from an opening "{" at `start` to its matching "}", respecting quoted strings. */
function findMatchingBraceEnd(text, start) {
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') { i++; continue; } // skip escaped char
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function scoreCandidate(data) {
  if (!data || typeof data !== 'object') return 0;
  let score = 0;
  if (safeNumber(data.score ?? data.coding_score) !== null) score += 1;
  if (safeNumber(data.total_problems_solved) !== null) score += 2;
  if (safeNumber(data.institute_rank) !== null) score += 1;
  if (safeNumber(data.pod_solved_current_streak) !== null) score += 1;
  return score;
}

/** Extracts every `self.__next_f.push([1,"<id>:<payload>"])` payload string, decoded, in order. */
function extractAllNextFChunks(html) {
  const chunks = [];
  const marker = 'self.__next_f.push([1,"';
  let searchFrom = 0;

  while (true) {
    const startIndex = html.indexOf(marker, searchFrom);
    if (startIndex === -1) break;

    const stringStart = startIndex + marker.length;
    const stringEnd = findJsStringEnd(html, stringStart);
    if (stringEnd === -1) break;

    const rawChunk = html.slice(stringStart, stringEnd);
    const decoded = decodeJsString(rawChunk);
    if (decoded) {
      // Chunks look like "6:[\"$\",...]" or "6:{...}" — strip the leading "<id>:" prefix.
      const colonIndex = decoded.indexOf(':');
      const jsonPart = colonIndex !== -1 ? decoded.slice(colonIndex + 1) : decoded;
      chunks.push(jsonPart);
    }

    searchFrom = stringEnd + 1;
  }

  return chunks;
}

function findJsStringEnd(text, start) {
  let pos = start;
  while (pos < text.length) {
    if (text[pos] === '"') {
      let backslashes = 0;
      let j = pos - 1;
      while (j >= 0 && text[j] === '\\') {
        backslashes += 1;
        j -= 1;
      }
      if (backslashes % 2 === 0) return pos;
    }
    pos += 1;
  }
  return -1;
}

function decodeJsString(raw) {
  // `raw` is the literal text between the quotes of a JS string literal exactly
  // as it appears in the page source — its escape sequences (\", \\, \n, \uXXXX)
  // are already valid JSON string escaping. Wrapping it in real quotes and
  // parsing decodes it correctly. (The previous version re-escaped every
  // backslash and quote here, which corrupts already-escaped content instead
  // of decoding it — that was silently breaking every single chunk.)
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return null;
  }
}

function safeNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function buildGFGHeatmap({ problemsSolved, codingScore }) {
  const days = 30;
  return Array.from({ length: days }, (_, index) => ({
    date: new Date(Date.now() - (days - index - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    count: Math.max(0, Math.min(6, Math.round(((problemsSolved || 0) / 300) * 2 + ((codingScore || 0) > 1000 ? 1 : 0))))
  }));
}

export async function getHeatmap(username) {
  const profile = await getGFGProfile(username);
  return profile.heatmap || [];
}

try {
  registerRefresher('gfg', async () => {
    try { return await getGFGProfile(); } catch (e) { return undefined; }
  });
} catch (e) {}