import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams,    setTeams]    = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks,    setTasks]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/teams'),
      api.get('/projects'),
    ]).then(([t, p]) => {
      setTeams(t.data.data);
      setProjects(p.data.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!projects.length) return;
    // load tasks for deadline soon count
    Promise.all(projects.slice(0, 3).map(p => api.get(`/tasks?projectId=${p._id}`)))
      .then(results => setTasks(results.flatMap(r => r.data.data)));
  }, [projects]);

  const now = new Date();
  const deadlineSoon = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    const diff = (new Date(t.dueDate) - now) / (1000*60*60*24);
    return diff >= 0 && diff <= 7;
  }).length;
  const waitingTasks = tasks.filter(t => t.status !== 'done').length;

  const statusColor = { 'In Progress':'var(--primary)', 'Planning':'var(--text-sub)', 'Done':'var(--green)', 'Review':'var(--amber)' };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        {/* Topbar */}
        <div className="topbar">
          <span className="topbar-title">Dashboard</span>
          <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
            <input className="input" placeholder="ค้นหาโปรเจค..." style={{ width:230 }} />
            <button className="btn-primary" onClick={() => navigate('/projects')}>+ สร้างโปรเจกต์</button>
          </div>
        </div>

        <div className="page-scroll">
          {/* Welcome */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
            <div>
              <h1 style={{ fontFamily:'Syne', fontSize:24, marginBottom:4 }}>
                สวัสดี, {user?.firstName}! 👋
              </h1>
              <p style={{ color:'var(--text-sub)', fontSize:14 }}>นี่คือภาพรวมของทีมและโปรเจกต์คุณวันนี้</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight:700 }}>{new Date().toLocaleDateString('th-TH', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="stat-grid">
            <div className="stat-box">
              <div className="stat-label">TEAMS</div>
              <div className="stat-number">{teams.length}</div>
              <div className="stat-hint up">ทีมของฉัน</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">PROJECTS</div>
              <div className="stat-number">{projects.length}</div>
              <div className="stat-hint up">โปรเจกต์ทั้งหมด</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">TASKS WAITING</div>
              <div className="stat-number">{waitingTasks}</div>
              <div className="stat-hint">งานที่ยังไม่เสร็จ</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">DEADLINE SOON</div>
              <div className="stat-number">{deadlineSoon}</div>
              <div className="stat-hint">ภายใน 7 วัน</div>
            </div>
          </div>

          {/* Cards grid */}
          {loading ? <div className="loading-text">กำลังโหลด...</div> : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Teams card */}
              <div className="card">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                  <span style={{ fontSize:13, color:'var(--text-sub)', fontWeight:700 }}>TEAMS ของฉัน</span>
                  <span onClick={() => navigate('/teams')} style={{ fontSize:12, color:'var(--text-sub)', cursor:'pointer' }}>ดูทั้งหมด</span>
                </div>
                {teams.length === 0 && <div className="empty-text">ยังไม่มีทีม</div>}
                {teams.map(t => (
                  <div key={t._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ width:38, height:38, background:'var(--surface-light)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                      {t.icon || t.name?.[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{t.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-sub)' }}>{t.role}</div>
                    </div>
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:15, fontWeight:700,
                      background: t.role === 'Owner' ? 'var(--primary-light)' : 'var(--surface-light)',
                      color: t.role === 'Owner' ? 'var(--primary)' : 'var(--text-sub)' }}>
                      {t.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Projects card */}
              <div className="card">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                  <span style={{ fontSize:13, color:'var(--text-sub)', fontWeight:700 }}>PROJECTS ล่าสุด</span>
                </div>
                {projects.length === 0 && <div className="empty-text">ยังไม่มีโปรเจกต์</div>}
                {projects.slice(0, 5).map(p => (
                  <div key={p._id}
                    onClick={() => navigate(`/projects/${p._id}`)}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid var(--border)', cursor:'pointer' }}>
                    <div style={{ width:9, height:9, borderRadius:'50%', background: statusColor[p.status] || 'var(--text-muted)', flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
                    </div>
                    <span style={{ fontSize:12, color: statusColor[p.status] || 'var(--text-sub)', fontWeight: p.status === 'In Progress' ? 700 : 400 }}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
