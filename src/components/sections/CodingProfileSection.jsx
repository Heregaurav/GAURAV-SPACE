import { useEffect, useMemo, useState } from 'react';
import { Activity, Award, BarChart3, Code2, Flame, GitBranch, Layers3, RefreshCw, Sparkles, Target, Trophy, Zap } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { COLORS, FONT, glassPanel } from './theme';

const platformIconMap = {
  LeetCode: Code2,
  Codeforces: Trophy,
  TryHackMe: Flame,
  GitHub: GitBranch,
  CodeChef: Trophy,
  GeeksforGeeks: Target,
};

const totalIconMap = {
  Solved: BarChart3,
  Contests: Trophy,
  Awards: Award,
};

const fallbackProfile = {
  platforms: [
    { platform: 'LeetCode', stat: '410+', statLabel: 'Solved', sub: 'Live backend data', href: 'https://leetcode.com/yourgaurav', accent: '#00d4ff' },
    { platform: 'CodeChef', stat: '—', statLabel: 'Rating', sub: 'Live backend data', href: 'https://www.codechef.com/users/spidermango', accent: '#b44fff' },
    { platform: 'GeeksforGeeks', stat: '—', statLabel: 'Solved', sub: 'Live backend data', href: 'https://www.geeksforgeeks.org/profile/gauravkuma160a?tab=activity', accent: '#00ff88' },
    { platform: 'GitHub', stat: '46+', statLabel: 'Repositories', sub: 'Live backend data', href: 'https://github.com/heregaurav', accent: '#00d4ff' },
  ],
  totals: [
    { label: 'Solved', value: '410+', accent: '#00d4ff', icon: 'Solved' },
    { label: 'Contests', value: '—', accent: '#b44fff', icon: 'Contests' },
    { label: 'Awards', value: '—', accent: '#00ff88', icon: 'Awards' },
  ],
  heatmap: [],
  solvedBreakdown: { Easy: 150, Medium: 222, Hard: 38 },
  current: { rating: '410 solved', weeklyContest: '—', rank: '—', date: new Date().toLocaleDateString('en-GB') },
};

// --- Detailed, GitHub/LeetCode-style contribution heatmap ------------------

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function buildWeeks(items) {
  const dataMap = new Map(items.map((item) => [item.date, Number(item.count) || 0]));

  const parsed = items.map((item) => new Date(item.date)).filter((d) => !isNaN(d));
  const endDate = parsed.length ? new Date(Math.max(...parsed)) : new Date();
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 364); // one year back
  startDate.setDate(startDate.getDate() - startDate.getDay()); // align to Sunday

  const weeks = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = toDateStr(cursor);
      const inRange = cursor <= endDate;
      week.push({ date: dateStr, count: inRange ? dataMap.get(dateStr) || 0 : 0, inRange });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function computeStreaks(items) {
  const sorted = [...items]
    .filter((i) => Number(i.count) > 0)
    .map((i) => i.date)
    .sort();
  if (!sorted.length) return { current: 0, max: 0 };

  let max = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      run += 1;
    } else {
      max = Math.max(max, run);
      run = 1;
    }
  }
  max = Math.max(max, run);

  // current streak: walk back from the most recent active date, must be
  // today or yesterday to still count as "current"
  const lastActive = new Date(sorted[sorted.length - 1]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceActive = Math.round((today - lastActive) / 86400000);

  let current = 0;
  if (daysSinceActive <= 1) {
    current = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const curr = new Date(sorted[i]);
      const prev = new Date(sorted[i - 1]);
      const diffDays = Math.round((curr - prev) / 86400000);
      if (diffDays === 1) current += 1;
      else break;
    }
  }

  return { current, max };
}

function Heatmap({ data = [] }) {
  const items = Array.isArray(data) ? data : [];
  const weeks = useMemo(() => buildWeeks(items), [items]);
  const max = useMemo(() => Math.max(...items.map((i) => Number(i.count) || 0), 1), [items]);
  const totalActivity = useMemo(() => items.reduce((sum, i) => sum + (Number(i.count) || 0), 0), [items]);
  const activeDays = useMemo(() => items.filter((i) => Number(i.count) > 0).length, [items]);
  const { current: currentStreak, max: maxStreak } = useMemo(() => computeStreaks(items), [items]);

  function colorFor(count) {
    if (!count) return 'rgba(255,255,255,0.045)';
    const intensity = count / max;
    if (intensity < 0.25) return 'rgba(0,212,255,0.28)';
    if (intensity < 0.5) return 'rgba(0,212,255,0.5)';
    if (intensity < 0.75) return 'rgba(0,212,255,0.72)';
    return 'rgba(0,212,255,0.98)';
  }

  const monthLabels = [];
  let lastMonth = null;
  weeks.forEach((week, i) => {
    const firstValid = week.find((d) => d.inRange) || week[0];
    const month = new Date(firstValid.date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ index: i, label: new Date(firstValid.date).toLocaleString('en-US', { month: 'short' }) });
      lastMonth = month;
    }
  });

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const cell = 22;
  const gap = 5;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Total activity', value: totalActivity },
          { label: 'Active days', value: activeDays },
          { label: 'Current streak', value: `${currentStreak}d` },
          { label: 'Longest streak', value: `${maxStreak}d` },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: '1 1 130px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.line}`,
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.2px', color: COLORS.textFaint, textTransform: 'uppercase' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: FONT.display, fontSize: '18px', fontWeight: 900, color: COLORS.textPrimary, marginTop: '4px' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '58px', overflowX: 'auto', paddingBottom: '18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, paddingTop: '12px', flexShrink: 0, minWidth: '56px' }}>
          {dayLabels.map((label, i) => (
            <div
              key={i}
              style={{ height: `${cell}px`, lineHeight: `${cell}px`, fontFamily: FONT.mono, fontSize: '9px', color: COLORS.textFaint }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={{ flexShrink: 0 }}>
          <div style={{ position: 'relative', height: '16px', marginBottom: '4px', width: `${weeks.length * (cell + gap)}px` }}>
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.index}`}
                style={{
                  position: 'absolute',
                  left: `${m.index * (cell + gap)}px`,
                  fontFamily: FONT.mono,
                  fontSize: '10px',
                  color: COLORS.textFaint,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {m.label}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: `${gap}px` }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={day.inRange ? `${day.count} activity on ${day.date}` : ''}
                    style={{
                      width: `${cell}px`,
                      height: `${cell}px`,
                      borderRadius: '3px',
                      background: day.inRange ? colorFor(day.count) : 'transparent',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', color: COLORS.textFaint, fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
        <span>Less</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 0.28, 0.5, 0.72, 0.98].map((level) => (
            <div
              key={level}
              style={{
                width: `${cell}px`,
                height: `${cell}px`,
                borderRadius: '3px',
                background: level === 0 ? 'rgba(255,255,255,0.045)' : `rgba(0,212,255,${level})`,
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

function formatMetric(value, fallback = '—') {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
}

function normalizeProfile(payload) {
  if (!payload) return fallbackProfile;

  if (Array.isArray(payload.platforms) && Array.isArray(payload.totals)) {
    return {
      ...fallbackProfile,
      ...payload,
      platforms: payload.platforms?.length ? payload.platforms : fallbackProfile.platforms,
      totals: payload.totals?.length ? payload.totals : fallbackProfile.totals,
      heatmap: Array.isArray(payload.heatmap) ? payload.heatmap : fallbackProfile.heatmap,
      solvedBreakdown: payload.solvedBreakdown || fallbackProfile.solvedBreakdown,
      current: payload.current || fallbackProfile.current,
    };
  }

  const { github, leet, codechef, gfg, aggregate } = payload;
  const platforms = [];

  if (github) {
    platforms.push({
      platform: 'GitHub',
      stat: `${github.public_repositories ?? github.repositories ?? 0}`,
      statLabel: 'Repositories',
      sub: `${github.followers ?? 0} followers • ${github.stars_received ?? 0} stars`,
      href: `https://github.com/${github.username || 'heregaurav'}`,
      accent: '#00d4ff',
      details: [
        { label: 'Followers', value: github.followers ?? '—' },
        { label: 'Stars', value: github.stars_received ?? '—' },
        { label: 'Top lang', value: github.languages?.[0] || '—' },
      ],
    });
  }

  if (leet) {
    platforms.push({
      platform: 'LeetCode',
      stat: `${leet.total_solved ?? 0}`,
      statLabel: 'Solved',
      sub: `${leet.streak?.current ?? 0} day streak`,
      href: `https://leetcode.com/${leet.username || 'yourgaurav'}`,
      accent: '#00d4ff',
      details: [
        { label: 'Ranking', value: leet.ranking ? `#${leet.ranking}` : '—' },
        { label: 'Easy', value: leet.easy_solved ?? '—' },
        { label: 'Medium', value: leet.medium_solved ?? '—' },
        { label: 'Hard', value: leet.hard_solved ?? '—' },
      ],
    });
  }

  if (codechef) {
    platforms.push({
      platform: 'CodeChef',
      stat: `${codechef.problems_solved ?? '—'}`,
      statLabel: 'Problems solved',
      sub: `${codechef.rating ?? '—'} rating`,
      href: `https://www.codechef.com/users/${codechef.username || 'spidermango'}`,
      accent: '#b44fff',
      details: [
        { label: 'Current rating', value: codechef.rating ?? '—' },
        { label: 'Highest rating', value: codechef.highest_rating ?? '—' },
        { label: 'Contests', value: codechef.contests ?? '—' },
      ],
    });
  }

  if (gfg) {
    platforms.push({
      platform: 'GeeksforGeeks',
      stat: `${gfg.problems_solved ?? '—'}`,
      statLabel: 'Problems solved',
      sub: `${gfg.coding_score ?? '—'} score`,
      href: `https://www.geeksforgeeks.org/profile/${gfg.username || 'gauravkuma160a'}?tab=activity`,
      accent: '#00ff88',
      details: [
        { label: 'Coding score', value: gfg.coding_score ?? '—' },
        { label: 'Institution rank', value: gfg.institution_rank ?? '—' },
        { label: 'Streak', value: gfg.streak ?? '—' },
        { label: 'Problems solved', value: gfg.problems_solved ?? '—' },
      ],
    });
  }

  return {
    ...fallbackProfile,
    platforms: platforms.length ? platforms : fallbackProfile.platforms,
    totals: [
      { label: 'Solved', value: `${aggregate?.totalSolved ?? leet?.total_solved ?? 0}`, accent: '#00d4ff', icon: 'Solved' },
      { label: 'Contests', value: `${aggregate?.totalContests ?? 0}`, accent: '#b44fff', icon: 'Contests' },
      { label: 'Stars', value: `${aggregate?.totalStars ?? github?.stars_received ?? 0}`, accent: '#00ff88', icon: 'Awards' },
    ],
    heatmap: Array.isArray(aggregate?.combinedHeatmap) ? aggregate.combinedHeatmap : fallbackProfile.heatmap,
    solvedBreakdown: leet ? { Easy: leet.easy_solved || 0, Medium: leet.medium_solved || 0, Hard: leet.hard_solved || 0 } : fallbackProfile.solvedBreakdown,
    current: {
      rating: leet ? `${leet.total_solved ?? 0} solved` : fallbackProfile.current.rating,
      weeklyContest: leet?.streak?.current ? `${leet.streak.current} day streak` : fallbackProfile.current.weeklyContest,
      rank: leet?.ranking ? `#${leet.ranking}` : fallbackProfile.current.rank,
      date: new Date().toLocaleDateString('en-GB'),
    },
  };
}

export default function CodingProfileSection() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  async function loadProfile({ refresh = false } = {}) {
    try {
      const url = `${API_BASE}/api/profile${refresh ? '?refresh=true' : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Profile endpoint unavailable');
      const data = await response.json();
      setProfile(normalizeProfile(data));
    } catch (error) {
      setProfile(normalizeProfile(null));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      if (cancelled) return;
      await loadProfile();
    }

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshProfile() {
    setRefreshing(true);
    await loadProfile({ refresh: true });
  }

  if (loading) {
    return (
      <SectionWrapper
        id="coding"
        index="03"
        eyebrow="Track Record"
        title="Coding profiles"
        description=" Problem-solving stats accross different Platforms :"
      ><div
  style={{
    ...glassPanel,
    padding: '50px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '22px',
    minHeight: '220px',
  }}
>
  <div
    style={{
      width: '56px',
      height: '56px',
      border: `3px solid ${COLORS.line}`,
      borderTop: `3px solid ${COLORS.neonBlue}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      boxShadow: `0 0 18px ${COLORS.neonBlue}55`,
    }}
  />

  <div
    style={{
      fontFamily: FONT.mono,
      fontSize: '12px',
      letterSpacing: '2px',
      color: COLORS.textFaint,
      textTransform: 'uppercase',
    }}
  >
    Loading Coding Profiles...
  </div>
</div>

      </SectionWrapper>
    );
  }

  if (!profile) {
    return (
      <SectionWrapper
        id="coding"
        index="03"
        eyebrow="Track Record"
        title="Coding profiles"
        description="Problem sovling stats."
      >
        <div style={{ ...glassPanel, padding: '32px', textAlign: 'center' }}>
          Unable to load coding profile data. Please try again later.
        </div>
      </SectionWrapper>
    );
  }

  const totalSolvedValue = profile.totals?.find((item) => item.label === 'Solved')?.value || '—';
  const summaryCards = [
    { label: 'Total solved', value: totalSolvedValue, accent: '#00d4ff', icon: Zap },
    { label: 'Combined streak', value: profile.current?.weeklyContest || '—', accent: '#b44fff', icon: Activity },
    { label: 'Repositories', value: profile.platforms?.find((p) => p.platform === 'GitHub')?.stat || '—', accent: '#00ff88', icon: Layers3 },
  ];
  const breakdownEntries = Object.entries(profile.solvedBreakdown || {});

  return (
    <SectionWrapper
      id="coding"
      index="03"
      eyebrow="Track Record"
      title="Coding profiles"
      description=" Problem-solving stats accross different Platforms : LeetCode, CodeChef and GeeksforGeeks as well as  GitHub."
    >
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={refreshProfile}
            disabled={refreshing || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '999px',
              border: `1px solid ${COLORS.line}`,
              background: refreshing ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
              color: COLORS.textPrimary,
              fontFamily: FONT.mono,
              fontSize: '11px',
              textTransform: 'uppercase',
              cursor: refreshing || loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={14} style={{ transform: refreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            {refreshing ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
        <div
          style={{
            ...glassPanel,
            padding: '28px 28px 32px',
            background: 'rgba(8, 12, 22, 0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow:
              '0 10px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: '26px', fontWeight: 900, color: COLORS.textPrimary, marginTop: '14px' }}>
                Building confidence, one problem at a time.
              </div>

            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', background: 'rgba(182, 185, 184, 0.1)', color: '#747575', fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.4px', textTransform: 'uppercase', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
        
              Actively Coding
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '22px' }}>
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} style={{ padding: '16px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.line}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.4px', color: COLORS.textFaint, textTransform: 'uppercase' }}>{card.label}</span>
                    <Icon size={15} color={card.accent} />
                  </div>
                  <div style={{ fontFamily: FONT.display, fontSize: '24px', fontWeight: 900, color: COLORS.textPrimary }}>{card.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...glassPanel, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: '19px', fontWeight: 900, color: COLORS.textPrimary }}>Combined contribution heatmap</div>
              <div style={{ fontFamily: FONT.body, fontSize: '12px', color: COLORS.textDim, marginTop: '4px' }}>LeetCode, CodeChef and GFG activity blended into one signal, past 52 weeks.</div>
            </div>
          </div>
          <Heatmap data={profile.heatmap} />
        </div>

        <div style={{ ...glassPanel, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontFamily: FONT.display, fontSize: '19px', fontWeight: 900, color: COLORS.textPrimary }}>Platform deep dive</div>
            <div style={{ fontFamily: FONT.mono, fontSize: '10px', color: COLORS.textFaint, textTransform: 'uppercase', letterSpacing: '1.4px' }}>Live details</div>
          </div>

          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {profile.platforms.map((platform) => {
              const Icon = platformIconMap[platform.platform] || Code2;
              return (
                <a
                  key={platform.platform}
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${COLORS.line}`,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={16} color={platform.accent} />
                      <div>
                        <div style={{ fontFamily: FONT.display, fontSize: '15px', fontWeight: 800, color: COLORS.textPrimary }}>{platform.platform}</div>
                        <div style={{ fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.2px', color: COLORS.textFaint, textTransform: 'uppercase' }}>{platform.statLabel}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: FONT.display, fontSize: '20px', fontWeight: 900, color: COLORS.textPrimary }}>{platform.stat}</div>
                      <div style={{ fontFamily: FONT.body, fontSize: '11px', color: COLORS.textDim }}>{platform.sub}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))', gap: '8px', marginTop: '12px' }}>
                    {(platform.details || []).map((detail) => (
                      <div key={detail.label} style={{ padding: '8px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.025)', border: `1px solid ${COLORS.line}` }}>
                        <div style={{ fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.2px', color: COLORS.textFaint, textTransform: 'uppercase', marginBottom: '4px' }}>{detail.label}</div>
                        <div style={{ fontFamily: FONT.display, fontSize: '13px', fontWeight: 800, color: COLORS.textPrimary }}>{formatMetric(detail.value)}</div>
                      </div>
                    ))}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ ...glassPanel, padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <BarChart3 size={16} color="#00d4ff" />
              <div style={{ fontFamily: FONT.display, fontSize: '19px', fontWeight: 900, color: COLORS.textPrimary }}>Solved breakdown</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {breakdownEntries.map(([level, value]) => (
                <div key={level} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: `1px solid ${COLORS.line}` }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.4px', color: COLORS.textFaint, textTransform: 'uppercase' }}>{level}</div>
                  <div style={{ fontFamily: FONT.display, fontSize: '24px', fontWeight: 900, color: COLORS.textPrimary, marginTop: '8px' }}>{formatMetric(value)}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...glassPanel, padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Award size={16} color="#b44fff" />
              <div style={{ fontFamily: FONT.display, fontSize: '19px', fontWeight: 900, color: COLORS.textPrimary }}>Overall performance</div>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {profile.totals.map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: `1px solid ${COLORS.line}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {(() => {
                      const Icon = totalIconMap[item.icon] || BarChart3;
                      return <Icon size={16} color={item.accent} />;
                    })()}
                    <span style={{ fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.4px', color: COLORS.textFaint, textTransform: 'uppercase' }}>{item.label}</span>
                  </div>
                  <span style={{ fontFamily: FONT.display, fontSize: '18px', fontWeight: 900, color: COLORS.textPrimary }}>{formatMetric(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}