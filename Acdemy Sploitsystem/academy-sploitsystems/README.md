# academy.sploitsystems.com

Premium cyber-tech IT academy website with React frontend and Node.js + Express backend.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + React Icons + React Three Fiber
- Backend: Node.js + Express + express-validator

## Project Structure

- `src/` frontend application
- `backend/src/` backend API (controllers, routes, validators, middleware, services)
- `UI_SPEC.md` complete spacing, sizing, and visual design spec

## Frontend Run

```bash
npm install
npm run dev
```

## Backend Run

```bash
cd backend
npm install
npm run dev
```

## API Endpoints

- `POST /api/v1/forms/contact`
- `POST /api/v1/forms/enroll`
- `POST /api/v1/forms/workshop`
- `GET /api/v1/health`

## SEO Baseline

- Title: `Sploitsystems Academy | Practical IT Courses`
- Description configured in `index.html`

## Notes

- Frontend form API base URL defaults to `http://localhost:5000/api/v1/forms`
- Override with env var `VITE_API_BASE_URL`
- Set `VITE_RECAPTCHA_SITE_KEY` in the frontend and `RECAPTCHA_SECRET_KEY` in the backend to enable Google reCAPTCHA v3
- Configure SMTP in `backend/.env` so contact, enroll, and workshop submissions email the correct mailboxes and BCC `qaisraniharis05@gmail.com`
- Architecture is ready for future MongoDB integration and LMS modules
