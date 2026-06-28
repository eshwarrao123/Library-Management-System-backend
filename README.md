# Library Management System API

A RESTful backend application for managing books, members, and borrowing activities in a library. Built with Node.js, Express, and MongoDB.

---

## Technologies Used

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **Deployment:** Render

---

## Project Structure

```text
library-management-system/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   ├── borrowController.js
│   └── memberController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── roleMiddleware.js
│   └── validationMiddleware.js
├── models/
│   ├── Book.js
│   ├── Borrow.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── memberRoutes.js
├── validators/
│   └── validationRules.js
├── .env
├── server.js
└── package.json
```

---

## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/eshwarrao123/Library-Management-System-backend.git
cd Library-Management-System-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
cp .env.example .env
```

Update the values in `.env` with your own credentials.

### 4. Run the server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key`
```

---

## Database Setup

This project uses **MongoDB Atlas** (cloud database).

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free account
2. Create a new cluster
3. Under **Database Access** — create a user with read/write permissions
4. Under **Network Access** — allow access from anywhere (`0.0.0.0/0`)
5. Click **Connect → Drivers** and copy the connection string
6. Paste it as `DATABASE_URL` in your `.env` file

### Creating a Librarian Account

Librarian accounts cannot be created via the register API. Insert one directly:

- Temporarily allow `role` in the register endpoint
- Register with `"role": "librarian"`
- Revert the change immediately after

---

## Authentication Flow

```
Register → Login → Receive JWT Token → Send Token in Header → Access Protected Routes
```
- Token must be sent as: `Authorization: Bearer <token>`
- Token expires in **1 day**
- Two roles exist: `member` and `librarian`
- Members can only register themselves — librarian accounts are created manually

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register as member |
| POST | `/api/auth/login` | Public | Login and get token |

### Books

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/books` | Member, Librarian | Get all books |
| GET | `/api/books/:id` | Member, Librarian | Get book by ID |
| POST | `/api/books` | Librarian only | Add new book |
| PUT | `/api/books/:id` | Librarian only | Update book |
| DELETE | `/api/books/:id` | Librarian only | Delete book |

### Borrow & Return

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/books/:id/borrow` | Member only | Borrow a book |
| POST | `/api/books/:id/return` | Member only | Return a book |
| GET | `/api/members/me/books` | Member only | Get my borrowed books |

### Members

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/members` | Librarian only | Get all members |
| DELETE | `/api/members/:id` | Librarian only | Delete a member |

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Action description here",
  "data": {}
}
```

---

## Deployment

Live API URL: `https://your-app-name.onrender.com`

---

## Postman Collection

Import the collection to test all endpoints:

[Download Postman Collection](https://raw.githubusercontent.com/eshwarrao123/Library-Management-System-backend/refs/heads/main/LibraryManagementSystem.postman_collection.json)

---

## Role-Based Authorization Summary

| Action | Member | Librarian |
|--------|--------|-----------|
| Register / Login | ✅ | ✅ |
| View Books | ✅ | ✅ |
| Add / Edit / Delete Books | ❌ | ✅ |
| Borrow / Return Books | ✅ | ❌ |
| View All Members | ❌ | ✅ |
| Delete Member | ❌ | ✅ |