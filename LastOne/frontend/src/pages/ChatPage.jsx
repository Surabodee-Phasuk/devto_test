import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { user }    = useAuth();
  const [projects,  setProjects]  = useState([]);
  const [selProj,   setSelProj]   = useState(null);
  const [chatRoom,  setChatRoom]  = useState(null);   // ProjectChat document
  const [messages,  setMessages]  = useState([]);
  const [text,      setText]      = useState('');
  const [loading,   setLoading]   = useState(false);
  const bottomRef   = useRef(null);

  // Load projects
  useEffect(() => {
    api.get('/projects').then(r => {
      setProjects(r.data.data);
      if (r.data.data.length) setSelProj(r.data.data[0]);
    });
  }, []);

  // Load (or auto-create) chat room when project selected
  // GET /api/projects/:projectId/chats
  useEffect(() => {
    if (!selProj) return;
    setLoading(true);
    setChatRoom(null); setMessages([]);
    api.get(`/projects/${selProj._id}/chats`)
      .then(r => setChatRoom(r.data.data))
      .finally(() => setLoading(false));
  }, [selProj]);

  // Load messages when chat room is known
  // GET /api/chats/:chatId/messages
  useEffect(() => {
    if (!chatRoom) return;
    api.get(`/chats/${chatRoom._id}/messages`)
      .then(r => setMessages(r.data.data));
  }, [chatRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // POST /api/chats/:chatId/messages
  const send = async e => {
    e.preventDefault();
    if (!text.trim() || !chatRoom) return;
    const { data } = await api.post(`/chats/${chatRoom._id}/messages`, { text: text.trim() });
    setMessages(m => [...m, data.data]);
    setText('');
  };

  const colors = ['','green','amber','blue','pink','red'];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area" style={{ flexDirection:'row' }}>
        {/* ── Project list sidebar ── */}
        <div style={{ width:220, borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', height:'100vh', flexShrink:0 }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:14 }}>Chat</div>
          <div style={{ overflowY:'auto', flex:1, padding:'12px' }}>
            <div className="menu-label">PROJECTS</div>
            {projects.map(p => (
              <div key={p._id} onClick={() => setSelProj(p)}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:8,
                  cursor:'pointer', marginBottom:2, fontSize:13.5,
                  background: selProj?._id === p._id ? 'var(--surface-hover)' : 'transparent',
                  color:      selProj?._id === p._id ? 'var(--text)' : 'var(--text-sub)' }}>
                → {p.name}
              </div>
            ))}
            {projects.length === 0 && <div className="empty-text" style={{ padding:16 }}>ยังไม่มีโปรเจกต์</div>}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', minWidth:0 }}>
          {/* Header */}
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <span style={{ fontWeight:700 }}>
              {selProj ? `→ ${selProj.name}` : 'เลือกโปรเจกต์'}
            </span>
            {chatRoom && (
              <span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:4 }}>
                chatId: {chatRoom._id}
              </span>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:4 }}>
            {loading && <div className="loading-text">กำลังโหลด...</div>}
            {!loading && messages.length === 0 && <div className="empty-text">ยังไม่มีข้อความ เริ่มสนทนาได้เลย!</div>}
            {messages.map((msg, i) => {
              const sender  = msg.senderId;
              const isMe    = sender?._id === user?._id;
              const initials = sender ? `${sender.firstName?.[0]}${sender.lastName?.[0]}`.toUpperCase() : '?';
              const color   = colors[i % colors.length];
              const time    = new Date(msg.createdAt).toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit' });

              return (
                <div key={msg._id} style={{ display:'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems:'flex-end', gap:8, marginBottom:6 }}>
                  {!isMe && (
                    <div className={`avatar ${color}`} style={{ width:32, height:32, fontSize:11, flexShrink:0 }}>{initials}</div>
                  )}
                  <div style={{ maxWidth:'65%' }}>
                    {!isMe && (
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:3, paddingLeft:2 }}>
                        {sender ? `${sender.firstName} ${sender.lastName}` : '?'} <span style={{ marginLeft:4 }}>{time}</span>
                      </div>
                    )}
                    <div style={{
                      background: isMe ? 'var(--primary)' : 'var(--surface-light)',
                      color: isMe ? '#fff' : 'var(--text)',
                      borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      padding:'10px 14px', fontSize:13.5, lineHeight:1.5,
                    }}>
                      {msg.text}
                    </div>
                    {isMe && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3, textAlign:'right', paddingRight:2 }}>{time}</div>}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} style={{ padding:'14px 20px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <input className="input" value={text} onChange={e => setText(e.target.value)}
              placeholder={chatRoom ? 'พิมพ์ข้อความ...' : 'เลือกโปรเจกต์เพื่อเริ่มแชท'}
              disabled={!chatRoom} style={{ flex:1 }} />
            <button className="btn-primary" type="submit" disabled={!text.trim() || !chatRoom} style={{ padding:'8px 18px' }}>↑</button>
          </form>
        </div>
      </div>
    </div>
  );
}
