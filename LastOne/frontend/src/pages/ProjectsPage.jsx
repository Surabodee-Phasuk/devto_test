import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUSES = [
  { key:'todo',       label:'To-Do',      color:'var(--text-sub)' },
  { key:'inprogress', label:'In Progress', color:'var(--primary)' },
  { key:'review',     label:'Review',      color:'var(--amber)' },
  { key:'done',       label:'Done',        color:'var(--green)' },
];
const CATEGORIES = ['Frontend','Backend','DevOps','Design','QA'];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects,    setProjects]    = useState([]);
  const [teams,       setTeams]       = useState([]);
  const [selProj,     setSelProj]     = useState(null);
  const [boards,      setBoards]      = useState([]);
  const [selBoard,    setSelBoard]    = useState(null);
  const [tasks,       setTasks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null);   // null | 'add' | task-obj
  const [form,        setForm]        = useState({ title:'', description:'', status:'todo', category:'Frontend', dueDate:'' });
  const [busy,        setBusy]        = useState(false);
  const [showNewProj, setShowNewProj] = useState(false);
  const [showNewBoard,setShowNewBoard]= useState(false);
  const [newProj,     setNewProj]     = useState({ name:'', teamId:'' });
  const [newBoardName,setNewBoardName]= useState('');

  // ── Load projects + teams ────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/teams')])
      .then(([p, t]) => {
        setProjects(p.data.data);
        setTeams(t.data.data);
        if (p.data.data.length) setSelProj(p.data.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Load boards when project changes ────────────────────────────────────
  useEffect(() => {
    if (!selProj) return;
    api.get(`/projects/${selProj._id}/boards`).then(r => {
      setBoards(r.data.data);
      setSelBoard(r.data.data[0] || null);
    });
  }, [selProj]);

  // ── Load tasks when board changes ────────────────────────────────────────
  const loadTasks = useCallback(() => {
    if (!selBoard) { setTasks([]); return; }
    api.get(`/boards/${selBoard._id}/tasks`).then(r => setTasks(r.data.data));
  }, [selBoard]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const colTasks = (key) => tasks.filter(t => t.status === key);

  // ── Task modal helpers ───────────────────────────────────────────────────
  const openAdd = (status = 'todo') => {
    setForm({ title:'', description:'', status, category:'Frontend', dueDate:'' });
    setModal('add');
  };
  const openEdit = (task) => {
    setForm({
      title: task.title, description: task.description || '',
      status: task.status, category: task.category,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setModal(task);
  };

  const saveTask = async () => {
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      if (modal === 'add') {
        await api.post(`/boards/${selBoard._id}/tasks`, { ...form, projectId: selProj._id });
      } else {
        await api.put(`/tasks/${modal._id}`, form);
      }
      loadTasks(); setModal(null);
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
    finally { setBusy(false); }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('ลบ task นี้?')) return;
    await api.delete(`/tasks/${taskId}`);
    loadTasks(); setModal(null);
  };

  // ── Create project ───────────────────────────────────────────────────────
  const createProject = async () => {
    if (!newProj.name || !newProj.teamId) return;
    setBusy(true);
    try {
      const { data } = await api.post('/projects', newProj);
      setProjects(p => [...p, data.data]);
      setSelProj(data.data);
      setShowNewProj(false); setNewProj({ name:'', teamId:'' });
    } finally { setBusy(false); }
  };

  // ── Create board ─────────────────────────────────────────────────────────
  const createBoard = async () => {
    if (!newBoardName.trim() || !selProj) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/projects/${selProj._id}/boards`, { name: newBoardName });
      setBoards(b => [...b, data.data]);
      setSelBoard(data.data);
      setShowNewBoard(false); setNewBoardName('');
    } finally { setBusy(false); }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        {/* ── Topbar ── */}
        <div className="topbar">
          <div className="breadcrumb">
            <span>{selProj?.name || 'Projects'}</span>
            {selBoard && <><span className="sep">/</span><span className="cur">{selBoard.name}</span></>}
          </div>
          <div style={{ display:'flex', gap:6, marginLeft:'auto', alignItems:'center' }}>
            {/* Board tabs */}
            {boards.map(b => (
              <button key={b._id} onClick={() => setSelBoard(b)}
                style={{ padding:'6px 14px', borderRadius:8, fontSize:13, cursor:'pointer',
                  border:'1px solid var(--border)', fontFamily:'inherit',
                  background: selBoard?._id === b._id ? 'var(--primary)' : 'transparent',
                  color:      selBoard?._id === b._id ? '#fff' : 'var(--text-sub)' }}>
                {b.name}
              </button>
            ))}
            <button className="btn-ghost" style={{ padding:'6px 10px', fontSize:18, lineHeight:1 }}
              title="เพิ่ม Board" onClick={() => setShowNewBoard(true)}>+</button>
            <button className="btn-ghost" onClick={() => setShowNewProj(true)}>+ โปรเจกต์ใหม่</button>
            <button className="btn-primary" onClick={() => openAdd()} disabled={!selBoard}>+ เพิ่ม Task</button>
          </div>
        </div>

        {/* ── Project tabs ── */}
        <div style={{ display:'flex', gap:6, padding:'10px 24px', borderBottom:'1px solid var(--border)', flexShrink:0, overflowX:'auto' }}>
          {projects.map(p => (
            <button key={p._id} onClick={() => setSelProj(p)}
              style={{ padding:'6px 14px', borderRadius:8, fontSize:12.5, cursor:'pointer',
                border:'1px solid var(--border)', fontFamily:'inherit', whiteSpace:'nowrap',
                background: selProj?._id === p._id ? 'var(--primary-light)' : 'transparent',
                color:      selProj?._id === p._id ? 'var(--primary)' : 'var(--text-sub)' }}>
              {p.name}
            </button>
          ))}
        </div>

        {/* ── Kanban Board ── */}
        <div style={{ flex:1, overflowX:'auto', overflowY:'hidden', padding:24, display:'flex', gap:16, alignItems:'flex-start' }}>
          {loading && <div className="loading-text" style={{ width:'100%' }}>กำลังโหลด...</div>}
          {!loading && !selBoard && (
            <div className="empty-text" style={{ width:'100%' }}>
              ยังไม่มี Board — กด <strong>+</strong> เพื่อสร้าง Sprint แรก
            </div>
          )}
          {!loading && selBoard && STATUSES.map(col => (
            <div key={col.key} style={{ width:265, flexShrink:0 }}>
              {/* Column header */}
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 4px', marginBottom:8 }}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:col.color }} />
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.8px', color:'var(--text-sub)', textTransform:'uppercase' }}>{col.label}</span>
                <div style={{ marginLeft:'auto', width:20, height:20, borderRadius:'50%', background:'var(--surface-light)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'var(--text-muted)', fontWeight:700 }}>
                  {colTasks(col.key).length}
                </div>
              </div>

              {/* Cards */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {colTasks(col.key).map(task => (
                  <TaskCard key={task._id} task={task} onOpen={() => openEdit(task)} />
                ))}
                <button onClick={() => openAdd(col.key)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 10px', borderRadius:8, fontSize:13,
                    color:'var(--text-muted)', cursor:'pointer', border:'1px dashed var(--border)',
                    background:'transparent', fontFamily:'inherit', width:'100%', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
                  + เพิ่ม Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Task Modal ── */}
      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="modal-title">{modal === 'add' ? 'เพิ่ม Task ใหม่' : 'แก้ไข Task'}</div>
            <div className="form-group">
              <label className="form-label">ชื่องาน *</label>
              <input className="input" value={form.title} onChange={e => setForm(f => ({...f, title:e.target.value}))} placeholder="ชื่อ task..." />
            </div>
            <div className="form-group">
              <label className="form-label">รายละเอียด</label>
              <textarea className="input" value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))}
                rows={3} placeholder="รายละเอียด..." style={{ resize:'vertical' }} />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">สถานะ</label>
                <select className="select" value={form.status} onChange={e => setForm(f => ({...f, status:e.target.value}))}>
                  {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">หมวดหมู่</label>
                <select className="select" value={form.category} onChange={e => setForm(f => ({...f, category:e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop:14 }}>
              <label className="form-label">กำหนดส่ง</label>
              <input className="input" type="date" value={form.dueDate} onChange={e => setForm(f => ({...f, dueDate:e.target.value}))} />
            </div>
            <div className="form-actions">
              {modal !== 'add' && (
                <button className="btn-danger" onClick={() => deleteTask(modal._id)}>ลบ Task</button>
              )}
              <button className="btn-ghost" onClick={() => setModal(null)}>ยกเลิก</button>
              <button className="btn-primary" onClick={saveTask} disabled={busy || !form.title.trim()}>
                {busy ? '...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Project Modal ── */}
      {showNewProj && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowNewProj(false)}>
          <div className="modal-box" style={{ width:380 }}>
            <button className="modal-close" onClick={() => setShowNewProj(false)}>✕</button>
            <div className="modal-title">สร้างโปรเจกต์ใหม่</div>
            <div className="form-group">
              <label className="form-label">ชื่อโปรเจกต์ *</label>
              <input className="input" value={newProj.name} onChange={e => setNewProj(n => ({...n, name:e.target.value}))} placeholder="Painner Web App" />
            </div>
            <div className="form-group">
              <label className="form-label">ทีม *</label>
              <select className="select" value={newProj.teamId} onChange={e => setNewProj(n => ({...n, teamId:e.target.value}))}>
                <option value="">เลือกทีม</option>
                {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button className="btn-ghost" onClick={() => setShowNewProj(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={createProject} disabled={busy || !newProj.name || !newProj.teamId}>
                {busy ? '...' : 'สร้าง'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Board Modal ── */}
      {showNewBoard && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowNewBoard(false)}>
          <div className="modal-box" style={{ width:360 }}>
            <button className="modal-close" onClick={() => setShowNewBoard(false)}>✕</button>
            <div className="modal-title">สร้าง Board ใหม่</div>
            <div className="form-group">
              <label className="form-label">ชื่อ Board (เช่น Sprint 1)</label>
              <input className="input" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} placeholder="Sprint 1" />
            </div>
            <div className="form-actions">
              <button className="btn-ghost" onClick={() => setShowNewBoard(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={createBoard} disabled={busy || !newBoardName.trim()}>
                {busy ? '...' : 'สร้าง Board'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onOpen }) {
  const due      = task.dueDate ? new Date(task.dueDate) : null;
  const isWarn   = due && (due - new Date()) / (1000*60*60*24) <= 3 && task.status !== 'done';
  const assignee = task.assigneeId;
  const initials = assignee ? `${assignee.firstName?.[0]}${assignee.lastName?.[0]}`.toUpperCase() : null;

  return (
    <div onClick={onOpen}
      style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:14, cursor:'pointer', transition:'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(124,92,252,0.3)'; e.currentTarget.style.background='var(--surface-hover)'; e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--surface)'; e.currentTarget.style.transform='none'; }}>
      <div style={{ fontWeight:600, fontSize:13.5, marginBottom:8, lineHeight:1.4 }}>{task.title}</div>
      <span className={`tag ${task.category}`}>{task.category}</span>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
        <div>
          {initials && (
            <div className="avatar" style={{ width:24, height:24, fontSize:9, border:'2px solid var(--surface)' }}>{initials}</div>
          )}
        </div>
        {due && (
          <div style={{ fontSize:10, color: isWarn ? 'var(--amber)' : 'var(--text-muted)', display:'flex', alignItems:'center', gap:3 }}>
            🕐 {due.toLocaleDateString('th-TH', { day:'numeric', month:'short' })}
          </div>
        )}
      </div>
    </div>
  );
}
