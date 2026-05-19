import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode]   = useState('login'); // 'login' | 'register'
  const [form, setForm]   = useState({ firstName:'', lastName:'', email:'', username:'', password:'' });
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else                  await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:400 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:32 }}>
          <div className="logo-icon">P</div>
          <span style={{ fontFamily:'Syne', fontWeight:700, fontSize:24 }}>Painner</span>
        </div>

        <div className="card" style={{ padding:28 }}>
          <h2 style={{ fontFamily:'Syne', fontSize:18, marginBottom:6 }}>
            {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </h2>
          <p style={{ color:'var(--text-sub)', fontSize:13, marginBottom:22 }}>
            {mode === 'login' ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่'}
          </p>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.12)', color:'#f87171', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:16 }}>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div className="form-row" style={{ marginBottom:14 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">ชื่อ</label>
                  <input className="input" name="firstName" value={form.firstName} onChange={handle} placeholder="John" required />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">นามสกุล</label>
                  <input className="input" name="lastName" value={form.lastName} onChange={handle} placeholder="Doe" required />
                </div>
              </div>
            )}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">ชื่อผู้ใช้งาน</label>
                <input className="input" name="username" value={form.username} onChange={handle} placeholder="john_dev" required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">อีเมล</label>
              <input className="input" name="email" type="email" value={form.email} onChange={handle} placeholder="john@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">รหัสผ่าน</label>
              <input className="input" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required minLength={6} />
            </div>
            <button className="btn-primary" type="submit" disabled={busy} style={{ width:'100%', padding:'10px', marginTop:6 }}>
              {busy ? 'กำลังโหลด...' : mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:18, fontSize:13, color:'var(--text-sub)' }}>
            {mode === 'login' ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'}{' '}
            <span
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ color:'var(--primary)', cursor:'pointer', fontWeight:600 }}
            >
              {mode === 'login' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
