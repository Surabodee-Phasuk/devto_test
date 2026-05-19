import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams,     setTeams]     = useState([]);
  const [selTeam,   setSelTeam]   = useState(null);
  const [members,   setMembers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showAdd,   setShowAdd]   = useState(false);
  const [showCreate,setShowCreate]= useState(false);
  const [addEmail,  setAddEmail]  = useState('');
  const [addRole,   setAddRole]   = useState('Member');
  const [newTeamName,setNewTeamName]=useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/teams').then(r => {
      setTeams(r.data.data);
      if (r.data.data.length) setSelTeam(r.data.data[0]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selTeam) return;
    api.get(`/teams/${selTeam._id}/members`).then(r => setMembers(r.data.data));
  }, [selTeam]);

  const loadMembers = () => selTeam && api.get(`/teams/${selTeam._id}/members`).then(r => setMembers(r.data.data));

  const createTeam = async () => {
    if (!newTeamName.trim()) return;
    setBusy(true);
    try {
      const { data } = await api.post('/teams', { name: newTeamName });
      setTeams(t => [...t, { ...data.data, role: 'Owner' }]);
      setSelTeam({ ...data.data, role: 'Owner' });
      setShowCreate(false); setNewTeamName('');
    } catch (e) { setError(e.response?.data?.message || 'Error'); }
    finally { setBusy(false); }
  };

  const addMember = async () => {
    setBusy(true); setError('');
    try {
      await api.post(`/teams/${selTeam._id}/members`, { email: addEmail, role: addRole });
      setShowAdd(false); setAddEmail('');
      loadMembers();
    } catch (e) { setError(e.response?.data?.message || 'Error'); }
    finally { setBusy(false); }
  };

  const changeRole = async (userId, role) => {
    await api.patch(`/teams/${selTeam._id}/members/${userId}`, { role });
    loadMembers();
  };

  const removeMember = async (userId) => {
    if (!confirm('ต้องการนำสมาชิกออกจากทีม?')) return;
    await api.delete(`/teams/${selTeam._id}/members/${userId}`);
    loadMembers();
  };

  const colors = ['','green','amber','blue','pink','red'];
  const roleColor = { Owner:'var(--primary)', Manager:'var(--amber)', Member:'var(--text-sub)' };
  const roleBg    = { Owner:'var(--primary-light)', Manager:'rgba(245,158,11,0.15)', Member:'var(--surface-light)' };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        {/* Topbar */}
        <div className="topbar">
          <span className="topbar-title">
            {selTeam ? `${selTeam.name} / สมาชิก` : 'Teams'}
          </span>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <button className="btn-ghost" onClick={() => { setShowCreate(true); setError(''); }}>+ สร้างทีมใหม่</button>
            {selTeam && <button className="btn-primary" onClick={() => { setShowAdd(true); setError(''); }}>+ เพิ่มสมาชิก</button>}
          </div>
        </div>

        <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
          {/* Team list sidebar */}
          <div style={{ width:220, borderRight:'1px solid var(--border)', padding:'16px 12px', overflowY:'auto', flexShrink:0 }}>
            <div className="menu-label">ทีมของฉัน</div>
            {teams.map(t => (
              <div key={t._id}
                onClick={() => setSelTeam(t)}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2,
                  background: selTeam?._id === t._id ? 'var(--primary-light)' : 'transparent',
                  color:      selTeam?._id === t._id ? 'var(--primary)' : 'var(--text-sub)' }}>
                <div style={{ width:22, height:22, background:'var(--surface-light)', borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                  {t.icon || t.name?.[0]}
                </div>
                <span style={{ fontSize:13.5 }}>{t.name}</span>
              </div>
            ))}
          </div>

          {/* Members table */}
          <div className="page-scroll">
            {loading && <div className="loading-text">กำลังโหลด...</div>}
            {!loading && !selTeam && <div className="empty-text">เลือกทีมเพื่อดูสมาชิก</div>}
            {selTeam && (
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {['สมาชิก','บทบาท','เข้าร่วมเมื่อ','จัดการ'].map(h => (
                      <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:11, color:'var(--text-muted)', fontWeight:700, letterSpacing:'0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 && (
                    <tr><td colSpan={4}><div className="empty-text">ยังไม่มีสมาชิก</div></td></tr>
                  )}
                  {members.map((m, i) => {
                    const u = m.user;
                    const initials = u ? `${u.firstName?.[0]}${u.lastName?.[0]}`.toUpperCase() : '?';
                    const color = colors[i % colors.length];
                    const isMe = u?._id === user?._id;
                    return (
                      <tr key={m._id} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'14px 12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div className={`avatar ${color}`} style={{ width:34, height:34, fontSize:12 }}>{initials}</div>
                            <div>
                              <div style={{ fontWeight:700, fontSize:14 }}>{u ? `${u.firstName} ${u.lastName}` : '—'}</div>
                              <div style={{ fontSize:12, color:'var(--text-sub)' }}>{u?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:'14px 12px' }}>
                          {isMe || m.role === 'Owner' ? (
                            <span style={{ fontSize:11, padding:'4px 10px', borderRadius:15, fontWeight:700,
                              background: roleBg[m.role], color: roleColor[m.role] }}>{m.role}</span>
                          ) : (
                            <select value={m.role} onChange={e => changeRole(u._id, e.target.value)}
                              style={{ background:'var(--surface-light)', border:'1px solid var(--border)', color:'var(--text)', borderRadius:8, padding:'4px 8px', fontSize:12 }}>
                              {['Member','Manager','Owner'].map(r => <option key={r}>{r}</option>)}
                            </select>
                          )}
                        </td>
                        <td style={{ padding:'14px 12px', fontSize:13, color:'var(--text-sub)' }}>
                          {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString('th-TH') : '—'}
                        </td>
                        <td style={{ padding:'14px 12px' }}>
                          {!isMe && m.role !== 'Owner' && (
                            <div style={{ display:'flex', gap:8 }}>
                              <button className="btn-ghost" style={{ padding:'4px 10px', fontSize:12 }}
                                onClick={() => changeRole(u._id, m.role === 'Member' ? 'Manager' : 'Member')}>แก้ไข</button>
                              <button className="btn-danger" style={{ padding:'4px 10px', fontSize:12 }}
                                onClick={() => removeMember(u._id)}>นำออก</button>
                            </div>
                          )}
                          {isMe && <span style={{ color:'var(--text-muted)', fontSize:12 }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add member modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            <div className="modal-title">เพิ่มสมาชิก</div>
            {error && <div style={{ color:'#f87171', fontSize:13, marginBottom:12 }}>{error}</div>}
            <div className="form-group">
              <label className="form-label">อีเมล</label>
              <input className="input" value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">บทบาท</label>
              <select className="select" value={addRole} onChange={e => setAddRole(e.target.value)}>
                {['Member','Manager','Owner'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={addMember} disabled={busy}>
                {busy ? '...' : 'เพิ่มสมาชิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create team modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal-box" style={{ width:360 }}>
            <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            <div className="modal-title">สร้างทีมใหม่</div>
            {error && <div style={{ color:'#f87171', fontSize:13, marginBottom:12 }}>{error}</div>}
            <div className="form-group">
              <label className="form-label">ชื่อทีม</label>
              <input className="input" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Dev Team Alpha" />
            </div>
            <div className="form-actions">
              <button className="btn-ghost" onClick={() => setShowCreate(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={createTeam} disabled={busy}>
                {busy ? '...' : 'สร้างทีม'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
