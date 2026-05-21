const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── User ────────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  username:   { type: String, required: true, unique: true, trim: true },
  password:   { type: String, required: true, minlength: 6 },
  avatarColor:{ type: String, default: 'purple' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};
userSchema.methods.toSafe = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// ── Team ────────────────────────────────────────────────────────────────────
const teamSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  icon:       { type: String, default: 'T' },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// ── TeamMember ──────────────────────────────────────────────────────────────
const teamMemberSchema = new mongoose.Schema({
  teamId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:      { type: String, enum: ['Owner', 'Manager', 'Member'], default: 'Member' },
  joinedAt:  { type: Date, default: Date.now },
}, { timestamps: true });
teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

// ── Project ─────────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  teamId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['Planning', 'In Progress', 'Review', 'Done'], default: 'Planning' },
}, { timestamps: true });

// ── Board (Sprint) ───────────────────────────────────────────────────────────
// Each project has multiple boards (e.g. Sprint 1, Sprint 2)
const boardSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },        // e.g. "Sprint 1"
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// ── Task ─────────────────────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  status:      { type: String, enum: ['todo', 'inprogress', 'review', 'done'], default: 'todo' },
  category:    { type: String, enum: ['Frontend', 'Backend', 'DevOps', 'Design', 'QA'], required: true },
  assigneeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  boardId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  dueDate:     { type: Date, default: null },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// ── ProjectMember ────────────────────────────────────────────────────────────
const projectMemberSchema = new mongoose.Schema({
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:        { type: String, enum: ['Owner', 'Manager', 'Member'], default: 'Member' },
  displayName: { type: String, trim: true, maxlength: 100, default: '' },
  avatarColor: { type: String, trim: true, default: '' },
  joinedAt:    { type: Date, default: Date.now },
}, { timestamps: true });
projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

// ── ProjectChat ──────────────────────────────────────────────────────────────
// One chat room per project
const projectChatSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
  name:      { type: String, trim: true, default: '' },
}, { timestamps: true });

// ── Message ──────────────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  chatId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectChat', required: true },
  senderId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:      { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

module.exports = {
  User:          mongoose.model('User', userSchema),
  Team:          mongoose.model('Team', teamSchema),
  TeamMember:    mongoose.model('TeamMember', teamMemberSchema),
  Project:       mongoose.model('Project', projectSchema),
  Board:         mongoose.model('Board', boardSchema),
  Task:          mongoose.model('Task', taskSchema),
  ProjectMember: mongoose.model('ProjectMember', projectMemberSchema),
  ProjectChat:   mongoose.model('ProjectChat', projectChatSchema),
  Message:       mongoose.model('Message', messageSchema),
};
