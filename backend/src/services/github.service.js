import axios from 'axios';
import { GraphQLClient, gql } from 'graphql-request';
import config from '../config/index.js';
import { registerRefresher } from '../cache/cache.js';
import { extractUsernameFromUrl } from '../utils/helpers.js';

const GITHUB_API = 'https://api.github.com/graphql';

function getClient() {
  if (!config.githubToken) return null;
  return new GraphQLClient(GITHUB_API, { headers: { Authorization: `Bearer ${config.githubToken}` } });
}

async function resolveLogin(username) {
  let login = username || config.githubUsername || process.env.GITHUB_USERNAME;
  if (!login) throw Object.assign(new Error('GITHUB_USERNAME not configured'), { status: 500 });
  if (typeof login === 'string' && login.includes('http')) {
    const parsed = extractUsernameFromUrl(login);
    if (parsed) login = parsed;
  }
  return login;
}

export async function getGithubProfile(username = undefined) {
  const login = await resolveLogin(username);
  const client = getClient();

  if (!client) {
    return getGithubProfileWithRest(login);
  }

  const query = gql`
    query userInfo($login: String!) {
      user(login: $login) {
        login
        name
        avatarUrl
        bio
        followers { totalCount }
        following { totalCount }
        repositories(privacy: PUBLIC, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            stargazerCount
            forkCount
            primaryLanguage { name color }
            url
            updatedAt
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount color }
            }
          }
          commitContributionsByRepository(maxRepositories: 20) { repository { name url } contributions(first: 1) { totalCount }}
        }
        repositoriesContributedTo(first: 20) { totalCount }
        pullRequests { totalCount }
        issues { totalCount }
      }
    }
  `;

  let data;
  try {
    data = await client.request(query, { login });
  } catch (err) {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      return getGithubProfileWithRest(login);
    }
    throw err;
  }

  const user = data.user;
  if (!user) throw Object.assign(new Error('GitHub user not found'), { status: 404 });

  const repositories = (user.repositories && user.repositories.nodes) || [];
  const topRepositories = repositories.slice(0, 6).map(r => ({ name: r.name, description: r.description, stars: r.stargazerCount, forks: r.forkCount, language: r.primaryLanguage && r.primaryLanguage.name, url: r.url }));
  const contributionCalendar = (user.contributionsCollection && user.contributionsCollection.contributionCalendar) || null;

  return {
    username: user.login,
    name: user.name,
    avatar: user.avatarUrl,
    bio: user.bio,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    repositories: user.repositories.totalCount,
    public_repositories: user.repositories.totalCount,
    stars_received: repositories.reduce((s, r) => s + (r.stargazerCount || 0), 0),
    forks: repositories.reduce((s, r) => s + (r.forkCount || 0), 0),
    pull_requests: user.pullRequests.totalCount,
    issues: user.issues.totalCount,
    contributions_this_year: contributionCalendar ? contributionCalendar.totalContributions : 0,
    contribution_calendar: transformGithubCalendar(contributionCalendar),
    heatmap: transformGithubHeatmap(contributionCalendar),
    languages: [...new Set(repositories.map(r => (r.primaryLanguage && r.primaryLanguage.name)).filter(Boolean))],
    top_repositories: topRepositories,
    recent_repositories: repositories.slice(0, 6).map(r => ({ name: r.name, url: r.url, updatedAt: r.updatedAt })),
    pinned: [],
  };
}

async function getGithubProfileWithRest(login) {
  const [userRes, reposRes] = await Promise.all([
    axios.get(`https://api.github.com/users/${encodeURIComponent(login)}`),
    axios.get(`https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated`),
  ]);

  const user = userRes.data || {};
  const repositories = (reposRes.data || []).filter(r => !r.fork);
  const topRepositories = repositories.slice(0, 6).map(r => ({
    name: r.name,
    description: r.description,
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    language: r.language,
    url: r.html_url,
  }));

  return {
    username: user.login,
    name: user.name,
    avatar: user.avatar_url,
    bio: user.bio,
    followers: user.followers || 0,
    following: user.following || 0,
    repositories: user.public_repos || 0,
    public_repositories: user.public_repos || 0,
    stars_received: repositories.reduce((s, r) => s + (r.stargazers_count || 0), 0),
    forks: repositories.reduce((s, r) => s + (r.forks_count || 0), 0),
    pull_requests: 0,
    issues: 0,
    contributions_this_year: 0,
    contribution_calendar: { totalContributions: 0, days: [] },
    heatmap: [],
    languages: [...new Set(repositories.map(r => r.language).filter(Boolean))],
    top_repositories: topRepositories,
    recent_repositories: topRepositories,
    pinned: [],
  };
}

function transformGithubCalendar(cal) {
  if (!cal) return { totalContributions: 0, weeks: [] };
  const weeks = cal.weeks.map(week => week.contributionDays.map(d => ({ date: d.date, count: d.contributionCount })) ).flat();
  return { totalContributions: cal.totalContributions, days: weeks };
}

function transformGithubHeatmap(cal) {
  if (!cal) return [];
  const days = cal.weeks.map(w => w.contributionDays).flat();
  return days.map(d => ({ date: d.date, count: d.contributionCount }));
}

export async function getGithubHeatmap(username) {
  const profile = await getGithubProfile(username);
  return profile.heatmap;
}

// register refresher for cache key 'github'
try {
  registerRefresher('github', async () => {
    try {
      const p = await getGithubProfile();
      return p;
    } catch (e) {
      return undefined;
    }
  });
} catch (e) {
  // ignore
}
