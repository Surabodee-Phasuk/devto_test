require('dotenv').config();
require('express-async-errors');

const express  = require('express');
const mongoose = require('mongoose')
const cors     = require('cors');

const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const teamRoutes    = require('./routes/teamRoutes');
const projectRoutes = require('./routes/projectRoutes');  // includes /boards + /chats sub-routes
const boardRoutes   = require('./routes/boardRoutes');    // /api/boards/:boardId
const taskRoutes    = require('./routes/taskRoutes');     // /api/tasks/:taskId
const memberRoutes  = require('./routes/memberRoutes');   // /api/projects/:projectId/members
const chatRoutes    = require('./routes/chatRoutes');     // /api/chats/:chatId/messages
const errorHandler  = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/teams',    teamRoutes);
app.use('/api/projects', projectRoutes);  // also handles /boards + /chats nested
app.use('/api/projects', memberRoutes);   // /api/projects/:projectId/members
app.use('/api/boards',   boardRoutes);    // /api/boards/:boardId + /api/boards/:boardId/tasks
app.use('/api/tasks',    taskRoutes);     // /api/tasks/:taskId
app.use('/api/chats',    chatRoutes);     // /api/chats/:chatId/messages

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

if (require.main === module) {
  const PORT      = process.env.PORT || 5000;
  const MONGO_URI = process.env.MONGO_URI;

  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
    })
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = app;
