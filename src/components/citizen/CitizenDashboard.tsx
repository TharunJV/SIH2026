import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

// ─── Asset base path (public/images/citizen-dashboard/) ──────────────────────
const A = '/images/citizen-dashboard/';

// ─── Static report data ───────────────────────────────────────────────────────
const STATIC_REPORTS = [
  {
    title: 'Road damaged near school',
    location: 'Ranchi, Jharkhand',
    date: 'Reported on 29 Aug 2024',
    updated: 'Updated 2 days ago',
    status: 'In Progress',
    statusKey: 'progress' as const,
    image: A + 'road-report.jpg',
  },
  {
    title: 'Streetlight not working',
    location: 'Khunti, Jharkhand',
    date: 'Reported on 27 Aug 2024',
    updated: 'Updated 4 days ago',
    status: 'Under Review',
    statusKey: 'review' as const,
    image: A + 'streetlight-report.jpg',
  },
  {
    title: 'Water shortage in community',
    location: 'Gumla, Jharkhand',
    date: 'Reported on 25 Aug 2024',
    updated: 'Updated 1 week ago',
    status: 'Resolved',
    statusKey: 'resolved' as const,
    image: A + 'water-report.jpg',
  },
] as const;

// ─── Static solution data ─────────────────────────────────────────────────────
const STATIC_SOLUTIONS = [
  {
    title: 'Smart Irrigation System',
    description: 'Helping farmers save water and increase crop yield.',
    institution: 'Kolhan University',
    status: 'Pilot Testing',
    statusKey: 'pilot' as const,
    image: A + 'irrigation-solution.jpg',
  },
  {
    title: 'Waste Management Solution',
    description: 'Turning waste into wealth for clean communities.',
    institution: 'BIT Sindri',
    status: 'Deployed',
    statusKey: 'deployed' as const,
    image: A + 'waste-solution.jpg',
  },
  {
    title: 'Solar Street Light',
    description: 'Providing sustainable lighting in rural and urban areas.',
    institution: 'Ranchi University',
    status: 'Implemented',
    statusKey: 'implemented' as const,
    image: A + 'solar-solution.jpg',
  },
] as const;

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
const SvgGrid = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const SvgFileEdit = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const SvgList = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const SvgLightbulb = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);
const SvgBell = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const SvgSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const SvgChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const SvgChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const SvgMapPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const SvgCalendar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const SvgHeart = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
// Stat card icons
const SvgStatReport = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const SvgStatProgress = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const SvgStatReview = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const SvgStatCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
// Impact icons
const SvgUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const SvgBuilding = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="9" width="18" height="13" /><path d="M8 22V12h8v10" />
    <path d="M3 9l9-7 9 7" />
  </svg>
);
const SvgLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.66a.78.78 0 0 0 .62 1.16.8.8 0 0 0 .72-.46C7.39 14.96 11.87 12.17 17 8z" />
    <path d="M17 8a18.45 18.45 0 0 1 4 13c-3.82-.41-7.38-2.07-10-5" />
  </svg>
);
const SvgAward = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);
// Notification icons
const SvgNotifDoc = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const SvgNotifClock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const SvgNotifCheck = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const SvgUniversity = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const SvgReportCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const SvgMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// ─── Status badge helper ──────────────────────────────────────────────────────
type StatusKey = 'progress' | 'review' | 'resolved' | 'pilot' | 'deployed' | 'implemented';
const STATUS_STYLES: Record<StatusKey, { bg: string; color: string }> = {
  progress:    { bg: '#fff0dc', color: '#c66a14' },
  review:      { bg: '#f4e5e8', color: '#8d3d4c' },
  resolved:    { bg: '#e8f1e3', color: '#477137' },
  pilot:       { bg: '#fff0dc', color: '#c66a14' },
  deployed:    { bg: '#e8f1e3', color: '#477137' },
  implemented: { bg: '#fdf0dc', color: '#b35c19' },
};

const StatusBadge: React.FC<{ label: string; statusKey: StatusKey }> = ({ label, statusKey }) => {
  const s = STATUS_STYLES[statusKey];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 9px', borderRadius: 6,
      fontSize: 9.5, fontWeight: 700, whiteSpace: 'nowrap',
      background: s.bg, color: s.color,
    }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>•</span>{label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const CitizenDashboard: React.FC = () => {
  const {
    currentUser,
    challenges,
    notifications,
    unreadNotifsCount,
    setCurrentView,
    markNotificationAsRead,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Derive live stats from real context data
  const totalIssues = challenges.length || 12;
  const inProgress = challenges.filter(
    (c) => ['In Development', 'Pilot', 'Assigned', 'Project Proposed'].includes(c.status)
  ).length || 5;
  const underReview = challenges.filter(
    (c) => ['Under Review', 'Submitted', 'Validated', 'University Matching'].includes(c.status)
  ).length || 6;
  const resolved = challenges.filter(
    (c) => ['Implemented', 'Impact Measured'].includes(c.status)
  ).length || 6;

  // First name from context
  const firstName = currentUser.name.split(' ')[0];

  // Initials for avatar
  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  // Real notifications (first 3), else static
  const recentNotifs = notifications.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('explore-challenges');
  };

  // ─── Citizen nav items ──────────────────────────────────────────────────────
  const navItems: Array<{ label: string; icon: React.ReactNode; view: string; active?: boolean; badge?: number }> = [
    { label: 'Dashboard',         icon: <SvgGrid />,       view: 'citizen-dashboard', active: true },
    { label: 'Report an Issue',   icon: <SvgFileEdit />,   view: 'submit-challenge' },
    { label: 'My Reports',        icon: <SvgList />,       view: 'explore-challenges' },
    { label: 'Discover Solutions',icon: <SvgLightbulb />,  view: 'explore-challenges' },
    { label: 'Notifications',     icon: <SvgBell />,       view: 'citizen-dashboard', badge: unreadNotifsCount },
  ];

  const STATIC_NOTIFS = [
    { icon: <SvgNotifDoc />,   iconCls: 'cd2-notif-icon--orange', title: 'Your issue has been assigned',  body: 'Road damaged near school has been assigned to Ranchi University.', time: '2 days ago' },
    { icon: <SvgNotifClock />, iconCls: 'cd2-notif-icon--amber',  title: 'Status updated',                body: 'Your water shortage issue is now under solution development.', time: '4 days ago' },
    { icon: <SvgNotifCheck />, iconCls: 'cd2-notif-icon--green',  title: 'Issue resolved',                body: 'Streetlight not working issue has been resolved successfully.', time: '5 days ago' },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          SCOPED STYLES
      ══════════════════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── Scoped reset ── */
        .cd2 *, .cd2 *::before, .cd2 *::after { box-sizing: border-box; }

        /* ── Root ── */
        .cd2 {
          --rust:   #c94820;
          --rust-d: #a93b18;
          --orange: #df7040;
          --amber:  #e7a43d;
          --rose:   #a65a69;
          --gold:   #c78611;
          --cream:  #fcf6eb;
          --paper:  #fffdfa;
          --ink:    #1a1815;
          --muted:  #756e66;
          --line:   #e9dece;
          --sh:     0 2px 12px rgba(80,50,20,.07);
          font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
          color: var(--ink);
          background: var(--cream);
          margin: 0;
          min-height: calc(100vh - 76px);
        }
        @media (min-width: 640px)  { .cd2 { margin: 0; } }
        @media (min-width: 1024px) { .cd2 { margin: 0; width: 100% } }

        /* ═══════════════════════════════════════════
           CITIZEN SECONDARY NAVBAR
        ═══════════════════════════════════════════ */
        .cd2-nav {
          height: 70px;
          background: #fffdf8;
          border-bottom: 1.5px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          box-sizing: border-box;
          position: sticky;
          top: 76px;
          z-index: 29;
          padding: 0 48px;
        }
        @media (max-width: 767px) { .cd2-nav { height: 60px; padding: 0 24px; overflow-x: auto; } }

        /* Left: nav links */
        .cd2-nav__links {
          display: flex;
          align-items: stretch;
          height: 100%;
          flex: 1 1 0;
          min-width: 0;
          gap: 30px;
        }
        @media (max-width: 900px) { .cd2-nav__links { display: none; } }

        /* Individual nav link button */
        .cd2-nav__item {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 0;
          border: 0;
          background: none;
          font-size: 12px;
          font-weight: 600;
          color: #1f2923;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color .14s;
          font-family: inherit;
          height: 100%;
          letter-spacing: 0;
        }
        .cd2-nav__item:hover { color: #e85f16; }
        .cd2-nav__item--active { color: #ee5d15; }
        .cd2-nav__item--active::after {
          content: "";
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 3px;
          background: #f2631b;
          border-radius: 0;
        }
        .cd2-nav__badge {
          display: grid; place-items: center;
          min-width: 17px; height: 17px;
          background: #ed5c15; color: #fff;
          border-radius: 50%; font-size: 9px; font-weight: 700;
          font-style: normal; flex-shrink: 0;
        }

        /* Right: search, bell, profile */
        .cd2-nav__right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 0 0 auto;
          box-sizing: border-box;
        }

        /* Search box */
        .cd2-search {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 220px;
          height: 40px;
          border: 1px solid #e6ddd0;
          border-radius: 9px;
          background: #fff;
          padding: 0 13px;
          flex-shrink: 0;
        }
        .cd2-search input {
          border: 0; outline: 0; background: none;
          flex: 1; min-width: 0; font-size: 12px; font-family: inherit; color: #8a8b87;
        }
        .cd2-search input::placeholder { color: #b8b0a8; }
        .cd2-search__btn {
          border: 0; background: none; cursor: pointer;
          display: flex; align-items: center;
          color: #5b655e; font-size: 20px; padding: 0; flex-shrink: 0;
        }
        @media (max-width: 660px) { .cd2-search { display: none; } }

        /* Bell */
        .cd2-bell {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 0; background: none; cursor: pointer;
          color: var(--muted);
          flex-shrink: 0;
          transition: background .14s;
        }
        .cd2-bell:hover { background: #f5ede0; color: var(--rust); }
        .cd2-bell__badge {
          position: absolute; top: -2px; right: -2px;
          width: 14px; height: 14px;
          background: var(--orange); color: #fff;
          border-radius: 50%; font-size: 8px; font-weight: 700;
          display: grid; place-items: center;
          border: 1.5px solid #fffdf8;
        }

        /* Profile */
        .cd2-profile {
          display: flex; align-items: center; gap: 6px;
          border: 0; background: none; cursor: pointer; padding: 0;
          flex-shrink: 0;
          transition: opacity .14s;
        }
        .cd2-profile:hover { opacity: .8; }
        .cd2-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          display: grid; place-items: center;
          background: #d59b68; color: #fff;
          font-weight: 700; font-size: 11px;
          border: 2px solid #fff;
          flex-shrink: 0;
        }
        .cd2-profile__text {
  text-align: left;
  min-width: 0;
  flex-shrink: 1;
}
      .cd2-profile__text strong {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}
        .cd2-profile__text small {
  display: block;
  font-size: 9.5px;
  color: var(--muted);
  margin-top: 1px;
}
        @media (max-width: 600px) { .cd2-profile__text { display: none; } }

        /* hamburger */
        .cd2-hamburger {
          display: none; border: 0; background: none; cursor: pointer;
          padding: 5px; color: var(--muted); border-radius: 6px; transition: background .14s;
        }
        .cd2-hamburger:hover { background: #f5ede0; }
        @media (max-width: 900px) { .cd2-hamburger { display: flex; align-items: center; } }

        /* mobile drawer */
        .cd2-drawer {
          display: none; flex-direction: column;
          position: fixed; inset: 0;
          background: rgba(255,253,249,.98); z-index: 200;
          padding: 20px 18px; gap: 3px; overflow-y: auto;
        }
        .cd2-drawer.open { display: flex; }
        .cd2-drawer__close {
          align-self: flex-end; border: 0; background: none;
          cursor: pointer; font-size: 22px; color: var(--muted); margin-bottom: 12px;
        }
        .cd2-drawer__item {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border: 0; background: none; border-radius: 9px;
          font-size: 14px; font-weight: 600; color: var(--ink);
          cursor: pointer; text-align: left; transition: background .14s; font-family: inherit;
        }
        .cd2-drawer__item:hover, .cd2-drawer__item--active { background: #fdf0e0; color: var(--rust); }

        /* ═══════════════════════════════════════════
           MAIN CONTENT AREA
        ═══════════════════════════════════════════ */
        .cd2-main {
          max-width: 1380px; margin: 0 auto; padding: 0 22px 40px;
        }
        @media (max-width: 600px) { .cd2-main { padding: 0 12px 28px; } }

        /* ── Welcome ── */
        .cd2-welcome {
          height: 112px; position: relative; padding-top: 26px; overflow: hidden;
          border-bottom: 1px solid var(--line);
        }
        .cd2-welcome h1 {
          font-size: 27px; margin: 0 0 5px; font-weight: 800; color: var(--ink);
          display: flex; align-items: center; gap: 8px;
        }
        .cd2-welcome p { font-size: 13.5px; margin: 0; color: var(--muted); }
        .cd2-heritage {
          position: absolute; right: -10px; top: -2px;
          width: 610px; height: 160px;
          object-fit: cover; mix-blend-mode: multiply; opacity: .82;
          pointer-events: none;
        }
        @media (max-width: 860px) { .cd2-heritage { opacity: .25; width: 360px; } }
        @media (max-width: 600px) {
          .cd2-welcome { height: 90px; padding-top: 18px; }
          .cd2-welcome h1 { font-size: 21px; }
          .cd2-heritage { display: none; }
        }

        /* ── Hero grid (Report card + Stats) ── */
        .cd2-hero {
          display: grid;
          grid-template-columns: minmax(360px, 1fr) minmax(500px, 1.45fr);
          gap: 14px; margin-top: 18px;
        }
        @media (max-width: 980px) { .cd2-hero { grid-template-columns: 1fr; } }

        /* Report card */
        .cd2-report-card {
          position: relative; overflow: hidden;
          border: 1px solid #efdabc; border-radius: 12px;
          background: linear-gradient(135deg, #fff9ed 0%, #f8e5c8 100%);
          box-shadow: var(--sh);
          display: flex; align-items: flex-start;
          padding: 20px 22px; min-height: 170px;
          cursor: pointer; text-align: left; font-family: inherit;
          transition: transform .16s, box-shadow .16s;
          color: #80341a;
        }
        .cd2-report-card:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(80,50,20,.13); }
        .cd2-rc-icon {
          width: 50px; height: 50px; border-radius: 50%; background: #fff;
          display: grid; place-items: center; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(80,46,18,.09); position: relative;
          color: var(--rust);
        }
        .cd2-rc-icon__plus {
          position: absolute; right: 5px; bottom: 4px;
          font-size: 11px; font-weight: 900; color: var(--rust); line-height: 1;
          font-style: normal;
        }
        .cd2-rc-copy { padding-left: 14px; flex: 1; position: relative; z-index: 2; }
        .cd2-rc-copy h2 { font-size: 15.5px; margin: 2px 0 8px; font-weight: 800; }
        .cd2-rc-copy p  { font-size: 12px; line-height: 1.6; margin: 0 0 16px; color: #5f5047; }
        .cd2-rc-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--rust); color: #fff;
          padding: 9px 16px; border-radius: 7px;
          font-size: 12px; font-weight: 700; border: 0; cursor: pointer;
          font-family: inherit; transition: background .14s;
        }
        .cd2-rc-btn:hover { background: var(--rust-d); }
        .cd2-map-img {
          position: absolute; right: 4px; bottom: -6px;
          width: 180px; height: 175px;
          object-fit: contain; mix-blend-mode: multiply; opacity: .72;
          pointer-events: none;
        }

        /* Stats grid */
        .cd2-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        @media (max-width: 680px) { .cd2-stats { grid-template-columns: repeat(2,1fr); } }

        .cd2-stat {
          background: var(--paper); border: 1px solid var(--line);
          border-radius: 12px; box-shadow: var(--sh);
          padding: 16px 16px 14px;
          display: flex; flex-direction: column; gap: 0;
        }
        .cd2-stat__icon {
          width: 42px; height: 42px; border-radius: 11px;
          display: grid; place-items: center; margin-bottom: 13px;
          color: #fff; flex-shrink: 0;
        }
        .cd2-stat__num {
          font-size: 28px; font-weight: 900; line-height: 1; color: var(--ink);
        }
        .cd2-stat__lbl {
          font-size: 11.5px; font-weight: 600; color: var(--muted); margin-top: 5px;
        }
        .cd2-stat__link {
          margin-top: 14px; color: var(--rust); background: none; border: 0;
          font-size: 11.5px; font-weight: 700; cursor: pointer;
          text-align: left; font-family: inherit; padding: 0;
          transition: opacity .14s;
        }
        .cd2-stat__link:hover { opacity: .7; }

        /* ── Middle 3-col grid ── */
        .cd2-mid {
          display: grid;
          grid-template-columns: 1.45fr .95fr .52fr;
          gap: 14px; margin-top: 16px;
        }
        @media (max-width: 1080px) {
          .cd2-mid { grid-template-columns: 1.3fr 1fr; }
          .cd2-impact { grid-column: 1/-1; }
          .cd2-impact-inner { display: grid; grid-template-columns: repeat(4,1fr); }
          .cd2-impact .cd2-panel-hdr { grid-column: 1/-1; }
        }
        @media (max-width: 720px) {
          .cd2-mid { grid-template-columns: 1fr; }
          .cd2-impact-inner { display: block; }
        }

        /* Panel */
        .cd2-panel {
          background: var(--paper); border: 1px solid var(--line);
          border-radius: 12px; box-shadow: var(--sh); overflow: hidden;
        }
        .cd2-panel-hdr {
          height: 46px; padding: 0 16px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #ece5d8;
        }
        .cd2-panel-hdr h2 { font-size: 14px; margin: 0; font-weight: 700; }
        .cd2-panel-hdr__link {
          font-size: 11px; color: #59382d; font-weight: 700;
          background: none; border: 0; cursor: pointer; font-family: inherit;
          white-space: nowrap; transition: opacity .14s;
        }
        .cd2-panel-hdr__link:hover { opacity: .7; }

        /* Report rows */
        .cd2-rrow {
          width: 100%; border: 0; border-top: 1px solid #ece5d8; background: none;
          display: grid; grid-template-columns: 86px 1fr 116px 18px;
          gap: 10px; padding: 8px 16px; text-align: left; align-items: center;
          cursor: pointer; transition: background .14s; font-family: inherit;
        }
        .cd2-rrow:hover { background: #fff8ee; }
        .cd2-rrow__img { width: 84px; height: 78px; border-radius: 8px; object-fit: cover; }
        .cd2-rrow__title {
          display: block; font-size: 13px; font-weight: 700;
          color: var(--ink); margin-bottom: 7px;
        }
        .cd2-rrow__meta {
          display: flex; align-items: center; gap: 4px;
          font-size: 10px; color: #6e665e; margin-top: 3px;
        }
        .cd2-rrow__right {
          display: flex; flex-direction: column; align-items: flex-end; gap: 9px;
        }
        .cd2-rrow__updated { font-size: 9px; color: #746c64; }
        .cd2-rrow__arrow { color: var(--muted); display: flex; align-items: center; }
        @media (max-width: 540px) {
          .cd2-rrow { grid-template-columns: 68px 1fr; padding: 10px 12px; }
          .cd2-rrow__img { width: 66px; height: 62px; }
          .cd2-rrow__right { grid-column: 2; align-items: flex-start; }
          .cd2-rrow__arrow { display: none; }
        }

        /* Notification items */
        .cd2-notif {
          display: grid; grid-template-columns: 38px 1fr;
          gap: 10px; padding: 10px 15px;
          border-top: 1px solid #ece5d8;
          cursor: pointer; transition: background .14s;
        }
        .cd2-notif:hover { background: #fdf6ed; }
        .cd2-notif-icon {
          width: 35px; height: 35px; border-radius: 50%;
          display: grid; place-items: center; color: #fff; flex-shrink: 0;
        }
        .cd2-notif-icon--orange { background: var(--orange); }
        .cd2-notif-icon--amber  { background: var(--amber);  }
        .cd2-notif-icon--green  { background: #7da25f;       }
        .cd2-notif__title { display: block; font-size: 11px; font-weight: 700; color: var(--ink); }
        .cd2-notif__body  { font-size: 10px; line-height: 1.45; color: #5e554e; margin: 3px 0 2px; }
        .cd2-notif__time  { font-size: 9px; color: #888; }

        /* Impact panel */
        .cd2-impact { }
        .cd2-impact-item {
          display: flex; align-items: center; gap: 12px; padding: 10px 16px;
        }
        .cd2-impact-icon { color: var(--rust); display: flex; align-items: center; flex-shrink: 0; }
        .cd2-impact-val  { display: block; font-size: 16px; font-weight: 800; color: var(--ink); }
        .cd2-impact-lbl  { display: block; font-size: 9.5px; color: #6e675f; margin-top: 2px; }

        /* ── Solutions section ── */
        .cd2-solutions { margin-top: 16px; }
        .cd2-sol-list  { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; padding: 0 16px 14px; }
        @media (max-width: 880px) { .cd2-sol-list { grid-template-columns: 1fr; } }

        .cd2-sol-card {
          display: grid; grid-template-columns: 155px 1fr;
          border: 1px solid #e8ddd0; border-radius: 10px; overflow: hidden;
          background: #fff; box-shadow: var(--sh);
        }
        @media (max-width: 500px) { .cd2-sol-card { grid-template-columns: 100px 1fr; } }
        .cd2-sol-card__img { width: 100%; height: 108px; object-fit: cover; }
        .cd2-sol-body { padding: 10px 11px; display: flex; flex-direction: column; }
        .cd2-sol-body h3 { font-size: 13px; margin: 0 0 5px; font-weight: 700; }
        .cd2-sol-body p  { font-size: 9.5px; line-height: 1.48; margin: 0; color: #5e5750; flex: 1; }
        .cd2-sol-footer {
          margin-top: 9px; display: flex; align-items: flex-end;
          justify-content: space-between; gap: 4px; flex-wrap: wrap;
        }
        .cd2-sol-footer small {
          font-size: 8.5px; color: #6e675f;
          display: flex; align-items: center; gap: 3px;
        }
        .cd2-sol-badge {
          display: inline-flex; padding: 3px 8px; border-radius: 5px;
          font-size: 8px; font-weight: 700; white-space: nowrap;
        }

        /* ── Bottom CTA ── */
        .cd2-cta {
          margin-top: 14px;
          background: #fbefd9; border: 1px solid #f0dfc2; border-radius: 10px;
          display: flex; align-items: center; padding: 13px 20px; gap: 14px;
          flex-wrap: wrap;
        }
        .cd2-cta-icon { color: var(--rust); display: flex; align-items: center; flex-shrink: 0; }
        .cd2-cta-text strong { display: block; font-size: 13px; font-weight: 700; }
        .cd2-cta-text span   { display: block; font-size: 10.5px; color: #514a43; margin-top: 2px; }
        .cd2-cta-btn {
          margin-left: auto; border: 0; background: var(--rust); color: #fff;
          padding: 11px 20px; border-radius: 8px; font-size: 12px; font-weight: 700;
          cursor: pointer; white-space: nowrap; font-family: inherit; flex-shrink: 0;
          transition: background .14s;
        }
        .cd2-cta-btn:hover { background: var(--rust-d); }
        @media (max-width: 580px) { .cd2-cta-btn { margin-left: 0; width: 100%; text-align: center; } }
      `}</style>

      <div className="cd2">

        {/* ══════════════════════════════════════════════════════════════════
            CITIZEN SECONDARY NAVBAR  (no logo – starts with nav items)
        ══════════════════════════════════════════════════════════════════ */}
        <nav className="cd2-nav" aria-label="Citizen navigation">

          {/* Left: navigation items */}
          <div className="cd2-nav__links">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`cd2-nav__item${item.active ? ' cd2-nav__item--active' : ''}`}
                onClick={() => setCurrentView(item.view as any)}
                type="button"
              >
                {item.icon}
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <b className="cd2-nav__badge">{item.badge}</b>
                )}
              </button>
            ))}
          </div>

          {/* Right: search + bell + profile */}
          <div className="cd2-nav__right">
            {/* Search */}
            <form className="cd2-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
              <button type="submit" className="cd2-search__btn" aria-label="Search">
                <SvgSearch />
              </button>
            </form>

            {/* Notification bell */}
            <button
              className="cd2-bell"
              onClick={() => setCurrentView('citizen-dashboard')}
              aria-label="Notifications"
              type="button"
            >
              <SvgBell />
              {unreadNotifsCount > 0 && (
                <b className="cd2-bell__badge">{unreadNotifsCount}</b>
              )}
            </button>

            {/* Profile */}
            <button className="cd2-profile" type="button" aria-label="Profile menu">
              <span className="cd2-avatar">{initials}</span>
              <span className="cd2-profile__text">
                <strong>{currentUser.name}</strong>
                <small>Citizen</small>
              </span>
              <span style={{ color: '#aaa', marginLeft: 2, display: 'flex', alignItems: 'center' }}>
                <SvgChevronDown />
              </span>
            </button>

            {/* Hamburger (mobile only) */}
            <button
              className="cd2-hamburger"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <SvgMenu />
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div className={`cd2-drawer${mobileNavOpen ? ' open' : ''}`} role="dialog" aria-label="Mobile navigation">
          <button className="cd2-drawer__close" onClick={() => setMobileNavOpen(false)} type="button">✕</button>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`cd2-drawer__item${item.active ? ' cd2-drawer__item--active' : ''}`}
              onClick={() => { setCurrentView(item.view as any); setMobileNavOpen(false); }}
              type="button"
            >
              {item.icon}{item.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════════════════════════ */}
        <main className="cd2-main">

          {/* ── Welcome ── */}
          <section className="cd2-welcome">
            <div>
              <h1>Namaste, {firstName}! <span role="img" aria-label="wave">👋</span></h1>
              <p>Together we can build a better and innovative Jharkhand.</p>
            </div>
            <img
              src="/images/citizen-dashboard/top-heritage.png"
              alt="Jharkhand heritage illustration"
              className="cd2-heritage"
            />
          </section>

          {/* ── Hero grid ── */}
          <section className="cd2-hero">

            {/* Report a New Issue card */}
            <button
              className="cd2-report-card"
              onClick={() => setCurrentView('submit-challenge')}
              type="button"
              aria-label="Report a New Issue"
            >
              <div className="cd2-rc-icon" aria-hidden="true">
                <SvgReportCardIcon />
                <i className="cd2-rc-icon__plus">+</i>
              </div>
              <div className="cd2-rc-copy">
                <h2>Report a New Issue</h2>
                <p>See a problem in your area?<br />Report it and help us solve it.</p>
                <span className="cd2-rc-btn" role="presentation">Report Now &nbsp;→</span>
              </div>
              <img
                src="/images/citizen-dashboard/report-map.png"
                alt="Jharkhand map"
                className="cd2-map-img"
              />
            </button>

            {/* Stats row */}
            <div className="cd2-stats">
              {/* Issues Reported */}
              <article className="cd2-stat">
                <span className="cd2-stat__icon" style={{ background: '#df7040' }}><SvgStatReport /></span>
                <span className="cd2-stat__num">{totalIssues}</span>
                <span className="cd2-stat__lbl">Issues Reported</span>
                <button className="cd2-stat__link" onClick={() => setCurrentView('explore-challenges')} type="button">View all →</button>
              </article>
              {/* In Progress */}
              <article className="cd2-stat">
                <span className="cd2-stat__icon" style={{ background: '#e7a43d' }}><SvgStatProgress /></span>
                <span className="cd2-stat__num">{inProgress}</span>
                <span className="cd2-stat__lbl">In Progress</span>
                <button className="cd2-stat__link" onClick={() => setCurrentView('explore-challenges')} type="button">View all →</button>
              </article>
              {/* Under Review */}
              <article className="cd2-stat">
                <span className="cd2-stat__icon" style={{ background: '#8d6a7f' }}><SvgStatReview /></span>
                <span className="cd2-stat__num">{underReview}</span>
                <span className="cd2-stat__lbl">Under Review</span>
                <button className="cd2-stat__link" onClick={() => setCurrentView('explore-challenges')} type="button">View all →</button>
              </article>
              {/* Resolved */}
              <article className="cd2-stat">
                <span className="cd2-stat__icon" style={{ background: '#c78611' }}><SvgStatCheck /></span>
                <span className="cd2-stat__num">{resolved}</span>
                <span className="cd2-stat__lbl">Resolved</span>
                <button className="cd2-stat__link" onClick={() => setCurrentView('explore-challenges')} type="button">View all →</button>
              </article>
            </div>
          </section>

          {/* ── Middle 3-column grid ── */}
          <div className="cd2-mid">

            {/* My Recent Reports */}
            <section className="cd2-panel">
              <div className="cd2-panel-hdr">
                <h2>My Recent Reports</h2>
                <button className="cd2-panel-hdr__link" onClick={() => setCurrentView('explore-challenges')} type="button">
                  View All →
                </button>
              </div>
              {STATIC_REPORTS.map((r) => (
                <button
                  key={r.title}
                  className="cd2-rrow"
                  onClick={() => setCurrentView('explore-challenges')}
                  type="button"
                >
                  <img className="cd2-rrow__img" src={r.image} alt={r.title} />
                  <span>
                    <span className="cd2-rrow__title">{r.title}</span>
                    <span className="cd2-rrow__meta"><SvgMapPin />&nbsp;{r.location}</span>
                    <span className="cd2-rrow__meta"><SvgCalendar />&nbsp;{r.date}</span>
                  </span>
                  <span className="cd2-rrow__right">
                    <StatusBadge label={r.status} statusKey={r.statusKey} />
                    <span className="cd2-rrow__updated">{r.updated}</span>
                  </span>
                  <span className="cd2-rrow__arrow"><SvgChevronRight /></span>
                </button>
              ))}
            </section>

            {/* Recent Notifications */}
            <section className="cd2-panel">
              <div className="cd2-panel-hdr">
                <h2>Recent Notifications</h2>
                <button className="cd2-panel-hdr__link" onClick={() => setCurrentView('citizen-dashboard')} type="button">
                  View All →
                </button>
              </div>

              {recentNotifs.length > 0 ? (
                recentNotifs.map((notif, idx) => {
                  const cfg = STATIC_NOTIFS[idx % STATIC_NOTIFS.length];
                  return (
                    <div
                      key={notif.id}
                      className="cd2-notif"
                      onClick={() => markNotificationAsRead(notif.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && markNotificationAsRead(notif.id)}
                    >
                      <span className={`cd2-notif-icon ${cfg.iconCls}`}>{cfg.icon}</span>
                      <div>
                        <span className="cd2-notif__title">{notif.title}</span>
                        <p className="cd2-notif__body">{notif.message}</p>
                        <span className="cd2-notif__time">{notif.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                STATIC_NOTIFS.map((n, i) => (
                  <div key={i} className="cd2-notif" role="article">
                    <span className={`cd2-notif-icon ${n.iconCls}`}>{n.icon}</span>
                    <div>
                      <span className="cd2-notif__title">{n.title}</span>
                      <p className="cd2-notif__body">{n.body}</p>
                      <span className="cd2-notif__time">{n.time}</span>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Impact So Far */}
            <section className="cd2-panel cd2-impact">
              <div className="cd2-panel-hdr">
                <h2>Impact So Far</h2>
                <button className="cd2-panel-hdr__link" onClick={() => setCurrentView('impact')} type="button">
                  View Impact →
                </button>
              </div>
              <div className="cd2-impact-inner">
                <div className="cd2-impact-item">
                  <span className="cd2-impact-icon"><SvgUsers /></span>
                  <div><span className="cd2-impact-val">8,246</span><span className="cd2-impact-lbl">People Benefited</span></div>
                </div>
                <div className="cd2-impact-item">
                  <span className="cd2-impact-icon"><SvgBuilding /></span>
                  <div><span className="cd2-impact-val">32</span><span className="cd2-impact-lbl">Solutions Developed</span></div>
                </div>
                <div className="cd2-impact-item">
                  <span className="cd2-impact-icon"><SvgLeaf /></span>
                  <div><span className="cd2-impact-val">18</span><span className="cd2-impact-lbl">Villages Impacted</span></div>
                </div>
                <div className="cd2-impact-item">
                  <span className="cd2-impact-icon"><SvgAward /></span>
                  <div><span className="cd2-impact-val">6</span><span className="cd2-impact-lbl">Projects Completed</span></div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Solutions ── */}
          <section className="cd2-panel cd2-solutions">
            <div className="cd2-panel-hdr">
              <h2>Solutions Inspired by Citizens Like You</h2>
              <button className="cd2-panel-hdr__link" onClick={() => setCurrentView('explore-challenges')} type="button">
                Explore All Solutions →
              </button>
            </div>
            <div className="cd2-sol-list">
              {STATIC_SOLUTIONS.map((s) => {
                const badge = STATUS_STYLES[s.statusKey];
                return (
                  <article key={s.title} className="cd2-sol-card">
                    <img className="cd2-sol-card__img" src={s.image} alt={s.title} />
                    <div className="cd2-sol-body">
                      <h3>{s.title}</h3>
                      <p>{s.description}</p>
                      <div className="cd2-sol-footer">
                        <small><SvgUniversity />&nbsp;{s.institution}</small>
                        <span
                          className="cd2-sol-badge"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {s.status}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <footer className="cd2-cta">
            <span className="cd2-cta-icon"><SvgHeart /></span>
            <div className="cd2-cta-text">
              <strong>Thank you for being a changemaker.</strong>
              <span>Your reports help build a better, stronger, and innovative Jharkhand.</span>
            </div>
            <button
              className="cd2-cta-btn"
              onClick={() => setCurrentView('submit-challenge')}
              type="button"
            >
              Report an Issue Now &nbsp;→
            </button>
          </footer>

        </main>
      </div>
    </>
  );
};
