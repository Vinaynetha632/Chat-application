🚀 FreeMessage – Real-Time Chat Application

ProMessage is a full-stack real-time one-to-one messaging application built using the MERN stack with Socket.io for instant communication.

It supports authentication, real-time messaging, online status tracking, unread message counts, seen ticks, and a modern dark-themed UI inspired by professional messaging platforms.

🛠 Tech Stack
💻 Frontend

React (Vite)

Tailwind CSS

React Router DOM

Axios

Socket.io Client

🖥 Backend

Node.js

Express.js

MongoDB (Mongoose)

Socket.io

JWT Authentication (HTTP-only cookies)

bcryptjs

cookie-parser

cors

dotenv

✨ Features
🔐 Authentication System

User Registration

User Login

JWT-based authentication

Protected Routes

Form validation:

Valid email format

Minimum 8 character password

Chrome autofill dark mode fix

💬 Real-Time Messaging

One-to-one private chat

Instant message delivery (Socket.io)

Enter to send message

Shift + Enter for new line

Auto-resizing textarea

Long messages wrap properly (WhatsApp-style)

Auto-scroll to latest message

🟢 Online User System

Live online/offline detection

"Active now" indicator

Online users appear at top

Real-time online user updates

📬 Smart Conversation Handling

Unread message badge count

Conversations move to top on new message

Seen ticks:

✓ Sent

✓✓ Seen

Messages automatically marked as seen when opened

🔎 Sidebar Features

User search functionality

Clean scroll experience (hidden scrollbars)

Modern dark UI

Responsive layout

📂 Project Structure
ProMessage/
│
├── client/
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Chat.jsx
│ │
│ ├── components/
│ │ ├── ProtectedRoute.jsx
│ │ ├── AuthNavbar.jsx
│ │
│ ├── context/
│ │ ├── AuthContext.jsx
│ │
│ ├── services/
│ │ ├── api.js
│ │
│ ├── App.jsx
│ └── index.css
│
├── server/
│ ├── config/
│ │ ├── db.js
│ │
│ ├── models/
│ │ ├── User.js
│ │ ├── Message.js
│ │ ├── Conversation.js
│ │
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── messageRoutes.js
│ │ ├── conversationRoutes.js
│ │
│ ├── controllers/
│ ├── middleware/
│ ├── socket/
│ │ ├── socket.js
│ │
│ ├── server.js
│ └── .env
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/Vinaynetha632/Chat-application.git
cd Freemessage
🔹 Backend Setup
cd server
npm install

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start backend server:

npm run dev

Backend runs on:

<!-- http://localhost:5000 -->
🔹 Frontend Setup
cd client
npm install
npm run dev

Frontend runs on:

http://localhost:5173
🔒 Environment Variables

Inside server/.env

PORT=5000
MONGO_URI=
JWT_SECRET=
🧠 What This Project Demonstrates

Full MERN stack architecture

REST API development

JWT authentication with cookies

Real-time communication using WebSockets

React state management with Context API

Protected routing

Modern UI design with Tailwind CSS

Handling UX edge cases:

Scroll behavior

Autofill issues

Text wrapping

Dynamic resizing inputs

Online user tracking system

Seen message system

🚀 Future Enhancements

Group chat functionality

Profile picture upload

File & image sharing

Message timestamps

Typing indicators

Push notifications

Deployment (Render / Railway / Vercel)

Mobile responsive optimization

Dark/Light mode toggle

👨‍💻 Author

Built with focus, debugging, and consistency.

📌 License

This project is open-source and available for learning and improvement.
