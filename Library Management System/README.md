# Library Management System

A full-stack undergraduate web development project using **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend), styled with **Bootstrap 5**.

## 1) Project Setup

### Prerequisites

- Node.js 20+
- MongoDB (local or cloud)

### Install frontend

```bash
npm install
```

### Install backend

```bash
cd server
npm install
```

### Configure environment

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster-name>.mongodb.net/library_management_system?retryWrites=true&w=majority&appName=<app-name>
```

For local-only development, you can still use:

```env
MONGODB_URI=mongodb://localhost:27017/library_management_system
```

Optional frontend env in root `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run backend

```bash
cd server
npm run dev
```

### Run frontend

```bash
npm run dev
```

### Seed sample data

```bash
cd server
npm run seed
```

### Import large books dataset from CSV

Uses `src/assets/book.csv` and inserts/updates books in MongoDB.

```bash
cd server
npm run seed:books
```

## Deploy on Vercel (Frontend + Backend)

### Backend deployment (Vercel)

1. In Vercel, create a new project from this same GitHub repo.
2. Set **Root Directory** to `Library Management System/server`.
3. Keep framework as **Other**.
4. Add environment variable:
   - `MONGODB_URI` = your MongoDB Atlas connection string.
   - Do not use `localhost` in Vercel env.
5. In MongoDB Atlas Network Access, allow Vercel to connect (quick start: `0.0.0.0/0`).
6. In MongoDB Atlas Database Access, ensure the DB user in URI has read/write permissions.
7. Deploy.

Backend routes will be available at:

- `/api/health`
- `/api/books`
- `/api/members`
- `/api/borrow-records`

### Frontend deployment (Vercel)

1. Create another Vercel project from the same repo.
2. Set **Root Directory** to `Library Management System`.
3. Add environment variable:
   - `VITE_API_BASE_URL` = your backend Vercel URL + `/api`
     (example: `https://your-backend.vercel.app/api`)
4. Deploy.

## 2) Folder Structure

```text
Library Management System/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── books/
│   │   ├── members/
│   │   └── borrowRecords/
│   ├── services/
│   └── App.jsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── seed/
│   └── package.json
├── plopfile.cjs
└── tools/plop-templates/
```

## 3) Scaffolding / Generator Usage

This project includes **Plop.js-style scaffolding configuration** for CRUD page skeletons.

Generator config:

- `plopfile.cjs`
- templates in `tools/plop-templates/`

Example command (after installing `plop`):

```bash
npx plop crud-page
```

What is generated automatically:

- List page skeleton
- Form page skeleton
- Details page skeleton

What was customized manually:

- Full Bootstrap UI/UX
- Routing and navigation
- Axios integrations and business workflows
- Data validations and error handling UX

## 4) Model Definitions

### Book

- id
- title
- author
- isbn (unique)
- category
- publicationYear
- totalCopies
- availableCopies
- shelfLocation
- coverImage
- createdAt
- updatedAt

### Member

- id
- fullName
- email
- phone
- membershipId (unique)
- address
- dateJoined
- status (active/inactive)
- createdAt
- updatedAt

### BorrowRecord

- id
- memberId
- bookId
- borrowDate
- dueDate
- returnDate
- status (borrowed/returned)
- createdAt
- updatedAt

## 5) API Endpoints (Plural Nouns, REST)

### Books

- `GET /api/books`
- `GET /api/books/:bookId`
- `POST /api/books`
- `PUT /api/books/:bookId`
- `DELETE /api/books/:bookId`
- `GET /api/books/:bookId/borrow-records`

### Members

- `GET /api/members`
- `GET /api/members/:memberId`
- `POST /api/members`
- `PUT /api/members/:memberId`
- `DELETE /api/members/:memberId`
- `GET /api/members/:memberId/borrowed-books`
- `GET /api/members/:memberId/borrow-records`

### Borrow Records

- `GET /api/borrow-records`
- `GET /api/borrow-records/:recordId`
- `POST /api/borrow-records`
- `PUT /api/borrow-records/:recordId`
- `DELETE /api/borrow-records/:recordId`

## 6) UI Action to HTTP Method Mapping

- Load books/members/details pages → `GET`
- Submit create forms (Add Book, Add Member, Issue Book) → `POST`
- Submit edit/update forms (Edit Book, Edit Member, Return Book) → `PUT`
- Delete book/member/record actions → `DELETE`

## 7) Statelessness (REST Reflection)

The API is stateless because each request includes all information needed for processing (resource ID in URI, payload in request body). The server does not rely on hidden session context to complete core CRUD and borrow/return operations.

## 8) Idempotent Endpoints (REST Reflection)

Idempotent endpoints in this API:

- `GET /api/books`, `GET /api/members/:memberId` (read-only, no state change)
- `PUT /api/books/:bookId`, `PUT /api/members/:memberId` (repeating same update results in same final state)
- `DELETE /api/members/:memberId` (resource remains deleted after first success)

Non-idempotent endpoint:

- `POST /api/books`, `POST /api/borrow-records` (repeated requests can create multiple resources)

## 9) Bootstrap + Design System Usage

- Bootstrap `Navbar` for top-level navigation
- Bootstrap `12-column grid` for dashboard cards, forms, and responsive layout
- Bootstrap `Cards`/surface panels for books and sections
- Bootstrap form controls with validation-ready patterns
- Bootstrap contextual buttons for Add, Edit, Delete, Borrow, Return, View Details

Custom design system:

- Primary background `#0B1020`
- Secondary background `#11182D`
- Accent cyan glow `#00E5FF`
- Accent violet `#8B5CF6`
- Success `#22C55E`, Warning `#F59E0B`, Danger `#F43F5E`
- Text primary `#E5ECF4`, muted `#94A3B8`

Visual polish:

- Soft glow shadows
- Hover lift transitions
- Smooth section entrance animation
- Rounded cards and controls

## 10) Features Checklist

- Book CRUD with search/filter by title/author/category
- Member CRUD with details and status
- Borrow/return workflow
- Borrow blocked when no `availableCopies`
- Automatic decrement/increment of `availableCopies`
- Member borrowed-books and borrowing history views
- RESTful URI design with hierarchical endpoints
