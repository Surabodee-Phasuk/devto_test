# Painner — CS369 Web Application

> Project Management Web App built with **React + Node.js + MongoDB**  
> นายสุรบดี ผาสุข (6609650707)

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Axios  |
| Backend   | Node.js, Express 4, MVC pattern   |
| Database  | MongoDB 7, Mongoose 8             |
| Auth      | JWT (7-day expiry)                |
| Container | Docker + docker-compose + nginx   |

---

## Architecture (MVC)

```
frontend/              ← React SPA (View)
  src/
  ├── pages/           ← หน้าต่างๆ (Dashboard, Teams, Projects, Chat, Profile)
  ├── components/      ← Sidebar (shared)
  ├── context/         ← AuthContext (global state)
  └── api/             ← axios instance

backend/               ← Node.js Express (Controller + Model)
  src/
  ├── controllers/     ← business logic
  ├── models/          ← Mongoose schemas
  ├── routes/          ← REST endpoints
  └── middleware/      ← authenticate (JWT), errorHandler
```

---

## API Endpoints

### Auth
| Method | Endpoint            | Description      |
|--------|---------------------|------------------|
| POST   | /api/auth/register  | สมัครสมาชิก     |
| POST   | /api/auth/login     | เข้าสู่ระบบ      |
| GET    | /api/auth/me        | ดูข้อมูลตัวเอง   |

### Teams
| Method | Endpoint                              | Description        |
|--------|---------------------------------------|--------------------|
| GET    | /api/teams                            | ทีมของฉัน          |
| POST   | /api/teams                            | สร้างทีม           |
| GET    | /api/teams/:teamId/members            | รายชื่อสมาชิก      |
| POST   | /api/teams/:teamId/members            | เพิ่มสมาชิก        |
| PATCH  | /api/teams/:teamId/members/:userId    | แก้ไข role         |
| DELETE | /api/teams/:teamId/members/:userId    | นำออกจากทีม       |

### Projects
| Method | Endpoint                   | Description        |
|--------|----------------------------|--------------------|
| GET    | /api/projects              | โปรเจกต์ทั้งหมด   |
| POST   | /api/projects              | สร้างโปรเจกต์      |
| PATCH  | /api/projects/:id          | แก้ไขโปรเจกต์      |
| DELETE | /api/projects/:id          | ลบโปรเจกต์         |
| GET    | /api/projects/:id/stats    | สถิติ task          |

### Tasks (CS367 feature)
| Method | Endpoint           | Description  |
|--------|--------------------|--------------|
| GET    | /api/tasks         | ดู tasks      |
| POST   | /api/tasks         | สร้าง task    |
| PATCH  | /api/tasks/:id     | **แก้ไข task** ← CS367 |
| DELETE | /api/tasks/:id     | ลบ task       |

### Members (CS367 feature)
| Method | Endpoint                                    | Description               |
|--------|---------------------------------------------|---------------------------|
| GET    | /api/projects/:projectId/members            | ดูสมาชิก                  |
| PATCH  | /api/projects/:projectId/members/:userId    | **แก้ไข profile** ← CS367 |

### Chat
| Method | Endpoint            | Description |
|--------|---------------------|-------------|
| GET    | /api/chat/messages  | ดูข้อความ   |
| POST   | /api/chat/messages  | ส่งข้อความ  |

### Users
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | /api/users/:id     | ดู profile        |
| PATCH  | /api/users/:id     | แก้ไข profile     |

---

## วิธีติดตั้งและรัน

### 1. Docker (แนะนำ — รันทุกอย่างด้วยคำสั่งเดียว)

```bash
git clone <repo-url>
cd painner
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

### 2. Local Development

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # แก้ MONGO_URI และ JWT_SECRET
npm run dev            # port 5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev            # port 3000 (proxy /api → localhost:5000)
```

---

## Features

| หน้า       | ฟีเจอร์                                                                |
|------------|------------------------------------------------------------------------|
| Login      | สมัครสมาชิก / เข้าสู่ระบบ ด้วย JWT                                   |
| Dashboard  | ภาพรวม: จำนวน Teams, Projects, Tasks, Deadline Soon                   |
| Teams      | สร้างทีม, เพิ่ม/แก้ไข/นำออก สมาชิก, เปลี่ยน role                    |
| Projects   | Kanban Board (To-Do / In Progress / Review / Done), CRUD tasks, Sprint |
| Chat       | แชทแยกตาม Team channel และ Project channel                            |
| Profile    | ดูและแก้ไขข้อมูลส่วนตัว, เปลี่ยนสีอวตาร ← **CS367 feature**         |

---

## Git Workflow

```
main      ← stable release
  └── develop
        ├── feature/edit-task
        ├── feature/edit-member-profile
        ├── feature/dashboard
        ├── feature/kanban-board
        └── feature/chat
```

```bash
# สร้าง feature branch
git checkout develop
git checkout -b feature/edit-task

# Commit & Push
git add .
git commit -m "feat(task): PATCH /api/tasks/:taskId"
git push origin feature/edit-task

# เปิด Pull Request → develop → review → merge
```
