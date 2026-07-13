import axios from 'axios';
import config from '../config/index.js';
import { registerRefresher } from '../cache/cache.js';
import { extractUsernameFromUrl } from '../utils/helpers.js';

const LEETCODE_API = 'https://leetcode.com/graphql';

// NOTE: the previous query never asked for calendar/streak data at all, so
// `calendar: []` and `streak: { current: 0, longest: 0 }` were always hardcoded —
// not fetched-and-empty, just never requested. `submissionCalendar` (a JSON string
// of `{ "<unix_timestamp_seconds>": count }`, one entry per active day, rolling
// ~1 year back) and `userCalendar { streak totalActiveDays }` are the real fields.
const profileQuery = `query userProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      userAvatar
      reputation
      ranking
      aboutMe
    }
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    languageProblemCount {
      languageName
      problemsSolved
    }
    submissionCalendar
    userCalendar {
      streak
      totalActiveDays
    }
  }
}`;

export async function getLeetCodeProfile(username = undefined) {
  let user = username || config.leetcodeUsername;
  if (user && typeof user === 'string' && user.includes('http')) user = extractUsernameFromUrl(user);
  if (!user) throw Object.assign(new Error('LEETCODE_USERNAME not configured'), { status: 500 });
  try {
    const resp = await axios.post(
      LEETCODE_API,
      { query: profileQuery, variables: { username: user }, operationName: 'userProfile' },
      { headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com', 'User-Agent': 'portfolio-backend/1.0 (+https://github.com)' } }
    );
    const data = resp.data;
    if (data.errors) throw Object.assign(new Error('LeetCode error'), { details: data.errors, status: 502 });
    const m = data.data.matchedUser;
    if (!m) throw Object.assign(new Error('LeetCode user not found'), { status: 404 });

    const easy = (m.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Easy') || {}).count || 0;
    const medium = (m.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Medium') || {}).count || 0;
    const hard = (m.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Hard') || {}).count || 0;
    const total = easy + medium + hard;

    return {
      username: m.username,
      avatar: m.profile?.userAvatar,
      reputation: m.profile?.reputation,
      ranking: m.profile?.ranking,
      easy_solved: easy,
      medium_solved: medium,
      hard_solved: hard,
      total_solved: total,
      calendar: transformCalendar(m.submissionCalendar),
      // LeetCode's API only exposes the *current* streak (consecutive active days
      // up to today) via userCalendar.streak — there's no "longest streak ever"
      // field available here, so we report `longest: null` rather than fabricating
      // a number the API never gave us.
      streak: {
        current: m.userCalendar?.streak ?? 0,
        longest: null,
      },
    };
  } catch (err) {
    if (err.response && err.response.status === 429) throw Object.assign(new Error('LeetCode rate limit'), { status: 429 });
    throw err;
  }
}

/**
 * `submissionCalendar` from LeetCode's API is a JSON-encoded string mapping
 * unix timestamps (seconds, UTC midnight of each active day) to submission
 * counts, e.g. `{"1664323200":1,"1664496000":4}` — NOT the GitHub-style
 * `{ weeks: [{ contributionDays: [...] }] }` shape the old parser assumed.
 */
function transformCalendar(submissionCalendarJson) {
  if (!submissionCalendarJson) return [];

  let raw;
  try {
    raw = typeof submissionCalendarJson === 'string' ? JSON.parse(submissionCalendarJson) : submissionCalendarJson;
  } catch {
    return [];
  }
  if (!raw || typeof raw !== 'object') return [];

  const days = Object.entries(raw).map(([timestampSeconds, count]) => {
    const date = new Date(Number(timestampSeconds) * 1000).toISOString().slice(0, 10);
    return { date, count: Number(count) || 0 };
  });

  days.sort((a, b) => new Date(a.date) - new Date(b.date));
  return days;
}

export async function getHeatmap(username) {
  const profile = await getLeetCodeProfile(username);
  return profile.calendar || [];
}

try {
  registerRefresher('leetcode', async () => {
    try { return await getLeetCodeProfile(); } catch (e) { return undefined; }
  });
} catch (e) {}