# Insyd Notification System - POC

This is a **proof-of-concept (POC)** for a notification system for the Insyd platform, a social web for the Architecture Industry. The system demonstrates how users can generate notifications for actions like likes, comments, follows, and new posts.

---

## Features

- Select a **Source User** (who performs the action)
- Select a **Target User** (who receives the notification)
- Simulate events: **Like, Comment, Follow, New Post**
- View notifications in real-time for the selected target user
- Mark notifications as **read**
- Fully functional frontend in **ReactJS**
- Backend API built with **NodeJS** and **SQLite**

---

## System Design Overview

1. **Backend**
   - Node.js + Express server
   - SQLite database with three tables:
     - `users` – stores user information
     - `events` – stores user actions/events
     - `notifications` – stores generated notifications
   - Event queue to process actions asynchronously
   - REST API endpoints:
     - `GET /api/users` – fetch all users
     - `POST /api/events` – create an event
     - `GET /api/notifications/:userId` – get notifications
     - `PATCH /api/notifications/:id/read` – mark notification as read
     - `GET /api/stats` – fetch system stats

2. **Frontend**
   - ReactJS application
   - User selection dropdowns (source and target)
   - Event simulation buttons
   - Notifications list with read/unread status
   - Real-time updates via event polling

---

## Setup Instructions

### Backend
1. Navigate to the backend folder:

cd backend
Install dependencies:

bash
Copy code
npm install
Start the server:

bash
Copy code
node index.js
Backend runs on http://localhost:3001 by default

Frontend
Navigate to the frontend folder:

bash
Copy code
cd frontend/insyd-fronted
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
Frontend runs on http://localhost:3000 by default

Usage
Open the frontend in the browser.

Select a Source User and a Target User.

Click one of the event buttons (Like, Comment, Follow, New Post).

Notifications for the target user will appear below.

Click Mark as read to update notification status.

Notes
Source user will not appear in the target user dropdown.

This is a POC, so authentication, caching, and responsive UI are not implemented.

Backend can be deployed using services like Render or Heroku.

GitHub Repositories
Backend: https://github.com/MaheshVeeraboina/insyd-backend-final

Frontend: https://github.com/MaheshVeeraboina/insyd-frontend


