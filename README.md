# News API

A REST API built with Express and TypeScript for user registration/login and article submission, backed by MySQL. No frontend — interact via `curl`.

## Tech Stack

- Express.js + TypeScript
- MySQL (via `mysql2`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Validation (`zod`)

## Prerequisites

- Node.js
- MySQL server running locally
- npm

## Installation

Clone the repository and move into the project folder:

```bash
git clone https://github.com/M-Kovaleva/DevPlatforms-CA.git
cd DevPlatforms-CA
```

Install dependencies:

```bash
npm install
```

## Database Setup

Create the database and tables by running the included schema file:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `news_db` database along with the `users` and `articles` tables.

> If your local MySQL is running on a non-default port (mine runs on `3307` due to a conflict with another local MySQL install), adjust the command accordingly, e.g.:
> `mysql -u root -p -P 3307 --protocol=tcp < database/schema.sql`

## Configuration

Create a `.env` file in the project root with your own values:

```
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=news_db
JWT_SECRET=a_long_random_secret_string
```

- `DB_PORT` — set this to `3306` if you're using a standard MySQL install, or to your custom port if (like mine) it's running elsewhere.
- `JWT_SECRET` should be a long, random string — it's used to sign and verify authentication tokens.
- `.env` is gitignored and should never be committed.

## Running the Project

```bash
npm run dev
```

Once running, the server is available at `http://localhost:3000` (or whatever `PORT` is set to).

## API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Log in, returns a JWT |
| GET | `/articles` | No | List all articles |
| POST | `/articles` | Yes | Submit a new article |
| GET | `/users` | No | List all users (no password hashes returned) |
| GET | `/users/me` | Yes | Returns the ID of the currently authenticated user |

Protected endpoints require an `Authorization` header:

```
Authorization: Bearer <token>
```

The token is returned from `POST /auth/login`.

## Validation Rules

**`POST /auth/register`**
- `email` — required, must be a valid email format
- `password` — required, minimum 8 characters, must include an uppercase letter, a lowercase letter, a number, and a special character

**`POST /auth/login`**
- `email` — required, must be a valid email format
- `password` — required (structure is not re-validated at login, only checked against the stored hash)

**`POST /articles`**
- `title` — required, 3–255 characters
- `body` — required, minimum 10 characters
- `category` — required, 2–100 characters

Requests that fail validation return `400` with a JSON error message and are not written to the database.

## Database Schema

**`users`**
- `id` — auto increment primary key
- `email` — unique
- `password_hash` — bcrypt hashed, never returned by the API
- `created_at`

**`articles`**
- `id` — auto increment primary key
- `title`
- `body`
- `category`
- `submitted_by` — id of the user who created it (foreign key → `users.id`)
- `created_at`

## Error Handling

All errors are returned as JSON in the form `{ "error": "message" }` (validation errors also include a `details` array), with an appropriate HTTP status code:

| Status | Meaning |
|---|---|
| 400 | Invalid or missing fields, failed validation |
| 401 | Missing token, invalid token, or invalid credentials |
| 403 | Invalid or expired token (JWT verification failed) |
| 404 | Route does not exist |
| 409 | Email already registered |
| 500 | Unexpected server or database error |

## Example Requests

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

**Get articles:**
```bash
curl http://localhost:3000/articles
```

**Create article (protected):**
```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My first article","body":"Enough characters to pass validation.","category":"Technology"}'
```

## Project Structure

```
src/
├── middleware/
│   ├── article-validation.ts   # Zod schema + middleware for articles
│   ├── auth-validation.ts      # Zod schemas + middleware for register/login
│   └── auth.ts                 # JWT authentication middleware
├── routes/
│   ├── articles.ts             # GET/POST /articles
│   ├── auth.ts                 # POST /auth/register, /auth/login
│   └── users.ts                # GET /users, GET /users/me
├── types/
│   └── express.d.ts            # Extends Express Request with req.user
├── utils/
│   └── jwt.ts                  # generateToken / verifyToken helpers
├── database.ts                 # MySQL connection pool
├── interfaces.ts               # Shared TypeScript interfaces
└── index.ts                    # App entry point, middleware, routing
database/
└── schema.sql                  # Database schema (CREATE DATABASE/TABLE)
```
