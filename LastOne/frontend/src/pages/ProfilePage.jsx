import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AVATAR_COLORS = ['purple','green','amber','blue','pink','red'];

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName:   user?.firstName   || '',
    lastName:    user?.lastName    || '',
    username:    user?.username    || '',
    avatarColor: user?.avatarColor || 'purple',
  });
  const [busy,    setBusy]    = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    setBusy(true); setError(''); setSuccess('');
    try {
      const { data } = await api.patch(`/users/${user._id}`, form);
      updateUser(data.data);
      setSuccess('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
    finally { setBusy(false); }
  };

  const initials = `${form.firstName[0] ?? ''}${form.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <div className="topbar">
          <span className="topbar-title">โปรไฟล์ของฉัน</span>
          <button className="btn-danger" style={{ marginLeft:'auto' }} onClick={() => { logout(); navigate('/login'); }}>
            ออกจากระบบ
          </button>
        </div>

        <div className="page-scroll">
          <div style={{ maxWidth:600 }}>
            {/* Avatar section */}
            <div className="card" style={{ marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:20 }}>
                <div className={`avatar ${form.avatarColor}`} style={{ width:72, height:72, fontSize:24 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontFamily:'Syne', fontSize:22, fontWeight:700 }}>
                    {form.firstName} {form.lastName}
                  </div>
                  <div style={{ color:'var(--text-sub)', fontSize:13 }}>
                    Owner · {user?.email}
                  </div>
                </div>
              </div>

              {/* Avatar color picker */}
              <div>
                <div className="form-label" style={{ marginBottom:8 }}>สีอวตาร</div>
                <div style={{ display:'flex', gap:8 }}>
                  {AVATAR_COLORS.map(c => (
                    <div key={c} onClick={() => setForm(f => ({...f, avatarColor:c}))}
                      className={`avatar ${c}`}
                      style={{ width:30, height:30, fontSize:10, cursor:'pointer',
                        outline: form.avatarColor === c ? '2px solid white' : 'none',
                        outlineOffset: 2, transition:'outline 0.1s' }}>
                      {c[0].toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <div style={{ fontFamily:'Syne', fontSize:15, fontWeight:700, marginBottom:20 }}>แก้ไขข้อมูลส่วนตัว</div>

              {error   && <div style={{ background:'rgba(239,68,68,0.12)', color:'#f87171', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:16 }}>{error}</div>}
              {success && <div style={{ background:'rgba(34,197,94,0.12)', color:'#4ade80', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:16 }}>{success}</div>}

              <form onSubmit={save}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ชื่อ</label>
                    <input className="input" name="firstName" value={form.firstName} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">นามสกุล</label>
                    <input className="input" name="lastName" value={form.lastName} onChange={handle} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
                  <input className="input" value={user?.email || ''} disabled style={{ opacity:0.5 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">ชื่อผู้ใช้งาน</label>
                  <input className="input" name="username" value={form.username} onChange={handle} required />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-ghost" onClick={() => setForm({ firstName:user.firstName, lastName:user.lastName, username:user.username, avatarColor:user.avatarColor || 'purple' })}>
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn-primary" disabled={busy}>
                    {busy ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
