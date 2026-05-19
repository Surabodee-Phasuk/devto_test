import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const avatarInitials = (user) =>
  user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : 'U';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;

  return (
    <div className="sidebar">
      <div className="logo-wrap">
        <div className="logo-icon">P</div>
        <span className="logo-text">Painner</span>
      </div>

      <div className="menu-label">MAIN MENU</div>

      <NavLink to="/dashboard" className={navClass}>
        <IconGrid /> Dashboard
      </NavLink>
      <NavLink to="/teams" className={navClass}>
        <IconTeam /> Teams
      </NavLink>
      <NavLink to="/projects" className={navClass}>
        <IconKanban /> Projects
      </NavLink>
      <NavLink to="/chat" className={navClass}>
        <IconChat /> Chat
      </NavLink>

      <div
        className="user-foot"
        onClick={() => navigate('/profile')}
      >
        <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
          {avatarInitials(user)}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>Owner</div>
        </div>
      </div>
    </div>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
  </svg>
);
const IconTeam = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2.5" fill="currentColor" opacity=".7"/>
    <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/>
    <circle cx="12.5" cy="5" r="2" fill="currentColor" opacity=".4"/>
    <path d="M14.5 13c0-1.93-1.34-3.5-3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".4"/>
  </svg>
);
const IconKanban = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="4" height="10" rx="1.5" fill="currentColor"/>
    <rect x="6" y="1" width="4" height="7"  rx="1.5" fill="currentColor"/>
    <rect x="11" y="1" width="4" height="13" rx="1.5" fill="currentColor"/>
  </svg>
);
const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 2V3Z" fill="currentColor" opacity=".7"/>
  </svg>
);
