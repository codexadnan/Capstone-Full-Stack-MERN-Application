# JobTrack — Job Application Tracker

JobTrack is a full-stack MERN web application designed to help users organize, track, and manage their job applications from a single dashboard.

Instead of managing applications through spreadsheets or scattered notes, JobTrack provides a centralized platform where users can securely create, update, view, filter, and manage their job application records.

## 🚀 Features

- 🔐 User Registration & Login
- 🔑 JWT-based Authentication
- 🛡️ Protected Routes
- 📊 Personalized Dashboard
- 💼 Create Job Applications
- ✏️ Edit Application Details
- 🗑️ Delete Applications
- 🔎 Search and Filter Applications
- 📑 Application Details View
- 📈 Application Statistics
- 👤 User Profile Management
- 📱 Responsive UI
- ⚠️ Form Validation & Error Handling
- 🔔 Toast Notifications
- ⏳ Loading States & Skeleton UI
- 📄 Pagination
- 🌐 RESTful API

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- Express Middleware

### Database
- MongoDB
- Mongoose

### Development Tools
- Git
- GitHub
- npm
- Vercel-ready frontend configuration

## 📁 Project Structure

```text
jobtrack/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── validators/
│   ├── package.json
│   └── server.js
│
├── DEPLOYMENT.md
├── TESTING.md
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/codexadnan/Capstone-Full-Stack-MERN-Application.git
cd Capstone-Full-Stack-MERN-Application
```

### 2. Install frontend dependencies

```bash
cd jobtrack/client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd jobtrack/server
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not upload your real `.env` file or secret API/database credentials to GitHub.

## ▶️ Running the Application

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

The frontend will normally be available through the Vite development server, while the backend runs on the configured API port.

## 🔄 Application Flow

```text
User
  ↓
Register / Login
  ↓
JWT Authentication
  ↓
Dashboard
  ↓
Create Job Application
  ↓
Track Application
  ↓
Update / Filter / Search
  ↓
View Application Details
```

## 🎯 Purpose

JobTrack was developed as a full-stack MERN capstone project to demonstrate practical skills in:

- Frontend development with React
- Backend development with Node.js and Express
- MongoDB database integration
- REST API development
- Authentication and authorization
- CRUD operations
- Form validation
- Error handling
- Responsive UI development
- Full-stack application architecture

## 🔮 Future Improvements

Potential future improvements include:

- Email notifications
- Job board integrations
- Resume management
- Interview scheduling
- Application reminders
- Analytics and advanced reporting
- AI-powered job recommendations
- AI resume analysis
- Automated job application tracking

## 👨‍💻 Author

**Muhammad Adnan**

GitHub: https://github.com/codexadnan

Portfolio: https://portfolio-eight-delta-7blam1yft1.vercel.app/

## 📄 License

This project is created for educational and portfolio purposes.
