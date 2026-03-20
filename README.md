# 🚀 Portfolio-Jeedy — Backend Server

> **Jerry-Bassey Bryan** | Backend Developer · Rivers State, Nigeria  
> *Building secure APIs, scalable systems, and robust databases.*

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

---

## 📖 Overview

This is the **backend server** powering my personal developer portfolio. It exposes a RESTful API that handles:

- A live API health/demo endpoint showcasing my tech stack
- A **contact form** that validates and persists messages to a MongoDB database via Mongoose
- A **messages retrieval** endpoint for viewing all contact submissions

The server is production-ready, secured with industry-standard middlewares, and designed to be deployed on cloud platforms such as [Render](https://render.com).

---

## 🗂️ Project Structure

```
Portfolio-Jeedy/
├── client/                  # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── cursor.css
│
└── server/                  # Backend (Node.js / Express)
    ├── config/
    │   └── database.js      # Mongoose connection setup
    ├── models/
    │   └── message.m.js     # Mongoose Message schema & model
    ├── server.js            # Main application entry point
    ├── package.json
    └── .env                 # Environment variables (not committed)
```

---

## ⚙️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js (v18+)                      |
| Framework    | Express.js v5                       |
| Database     | MongoDB (via Mongoose ODM)          |
| Security     | Helmet, CORS, express-rate-limit    |
| Config       | dotenv                              |
| Deployment   | Render (cloud)                      |

---

## 🔌 API Endpoints

### `GET /api`
Returns a JSON payload confirming the server is running and showcasing developer info.

**Response:**
```json
{
  "message": "Backend is running",
  "developer": "Jerry-Bassey Bryan",
  "skills": ["Node.js", "APIs", "Security", "Databases"]
}
```

---

### `POST /contact`
Validates and stores a contact form submission to MongoDB.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello, I'd love to work with you!"
}
```

**Success Response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello, I'd love to work with you!",
    "createdAt": "2026-02-23T14:00:00.000Z",
    "updatedAt": "2026-02-23T14:00:00.000Z"
  }
}
```

**Error Response** `400 Bad Request`:
```json
{ "message": "All fields required" }
```

---

### `GET /messages`
Returns all contact form submissions ordered by most recent first.

**Success Response** `200 OK`:
```json
[
  {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello!",
    "createdAt": "2026-02-23T14:00:00.000Z",
    "updatedAt": "2026-02-23T14:00:00.000Z"
  }
]
```

---

## �️ Data Model

The `Message` model is defined using **Mongoose** with built-in validation and automatic timestamps.

```js
// models/message.m.js
const messageSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);
```

---

## �🛡️ Security Features

- **[Helmet](https://helmetjs.github.io/)** — Sets secure HTTP response headers to protect against well-known web vulnerabilities.
- **[CORS](https://www.npmjs.com/package/cors)** — Configures Cross-Origin Resource Sharing policies.
- **[express-rate-limit](https://www.npmjs.com/package/express-rate-limit)** — Limits each IP to **50 requests per 15 minutes** to protect against brute-force and spam attacks.
- **Mongoose Validation** — Schema-level validation ensures only clean, complete data reaches the database.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A MongoDB database URI — use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier), [Railway](https://railway.app/), or a local MongoDB instance.

### 1. Clone the Repository

```bash
git clone https://github.com/JeedyWhyte/Portfolio-Jeedy.git
cd Portfolio-Jeedy/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio
PORT=5000
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

### 5. Production Start

```bash
npm start
```

---

## 🌐 Deployment (Render)

1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set the **Root Directory** to `server`.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `npm start`.
6. Add your `MONGODB_URI` and `PORT` as environment variables in the Render dashboard.

---

## 📦 Dependencies

| Package               | Version   | Purpose                              |
|-----------------------|-----------|--------------------------------------|
| `express`             | ^5.2.1    | Web framework                        |
| `mongoose`            | ^8.15.0   | MongoDB ODM (schema, validation)     |
| `cors`                | ^2.8.6    | Cross-Origin Resource Sharing        |
| `helmet`              | ^8.1.0    | HTTP security headers                |
| `express-rate-limit`  | ^8.2.1    | Rate limiting middleware             |
| `dotenv` *(dev)*      | ^17.3.1   | Environment variable loader          |

---

## 👤 Author

**Jerry-Bassey Bryan**  
📧 [bryanaghogho@outlook.com](mailto:bryanaghogho@outlook.com)  
🐦 [@JeedyWhyte](https://x.com/JeedyWhyte)  
🐙 [github.com/JeedyWhyte](https://github.com/JeedyWhyte)  
📍 Rivers State, Nigeria

---

## 📄 License

This project is licensed under the **ISC License**.  
See the [LICENSE](https://opensource.org/licenses/ISC) file for details.

---

*Built with ❤️ by Jerry-Bassey Bryan — Backend Developer*
