import axios from 'axios';
import config from '../config/index.js';
import { registerRefresher } from '../cache/cache.js';
import { extractUsernameFromUrl } from '../utils/helpers.js';

const LEETCODE_API = 'https://leetcode.com/graphql';

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
  }
}`;

export async function getLeetCodeProfile(username = undefined) {
  let user = username || config.leetcodeUsername;
  if (user && typeof user === 'string' && user.includes('http')) user = extractUsernameFromUrl(user);
  if (!user) throw Object.assign(new Error('LEETCODE_USERNAME not configured'), { status: 500 });
  try {
    const resp = await axios.post(LEETCODE_API, { query: profileQuery, variables: { username: user }, operationName: 'userProfile' }, { headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com', 'User-Agent': 'portfolio-backend/1.0 (+https://github.com)' } });
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
      calendar: [],
      streak: { current: 0, longest: 0 }
    };
  } catch (err) {
    if (err.response && err.response.status === 429) throw Object.assign(new Error('LeetCode rate limit'), { status: 429 });
    throw err;
  }
}

function transformCalendar(cal) {
  if (!cal) return [];
  // Expected shape: { totalActiveDays, weeks: [ { contributionDays: [{ date, contributionCount }] } ] }
  const days = [];
  try {
    const weeks = cal.weeks || [];
    for (const week of weeks) {
      const contribDays = week.contributionDays || [];
      for (const d of contribDays) {
        if (d && d.date) days.push({ date: d.date, count: Number(d.contributionCount || 0) });
      }
    }
  } catch (e) {
    return [];
  }

  // ensure unique by date (some calendars include overlapping ranges) and sort
  const map = new Map();
  for (const d of days) map.set(d.date, (map.get(d.date) || 0) + d.count);
  const arr = Array.from(map.entries()).map(([date, count]) => ({ date, count }));
  arr.sort((a, b) => new Date(a.date) - new Date(b.date));
  return arr;
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
