# Sports Equipment Management System - Setup Guide

## Prerequisites Installation

Before starting the application, ensure you have:

### 1. Node.js Installation
- Download from: https://nodejs.org/
- Recommended: LTS version (v18 or v20)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Git Installation (Optional)
- Download from: https://git-scm.com/
- Verify: `git --version`

## Step-by-Step Setup

### Step 1: Clone or Extract Project

Extract the project to your desired location:
```
e:\sport management\
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Initialize database (creates sports_management.db)
npm run init-db

# Start server
npm start
```

✓ Backend running at: http://localhost:5000

### Step 3: Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies
npm install

# Start development server
npm start
```

✓ Frontend running at: http://localhost:3000

## First Time Usage

### 1. Add Sample Students
- Go to Students page
- Click "Add New Student"
- Fill in details:
  - Name: John Doe
  - Roll No: A001
  - Class: 10A
  - Phone: 9876543210
- Click "Add Student"

### 2. Add Sample Equipment
- Go to Equipment page
- Click "Add New Equipment"
- Fill in details:
  - Equipment Name: Cricket Bat
  - Category: Cricket
  - Total Quantity: 10
- Click "Add Equipment"

### 3. Issue Equipment
- Go to "Issue Items"
- Select Student: John Doe
- Select Equipment: Cricket Bat
- Quantity: 2
- Click "Issue Equipment"

### 4. Return Equipment
- Go to "Return Items"
- Find the issued item
- Click "Return"

### 5. View Reports
- Go to "Reports"
- See transaction history
- Export to CSV if needed

## Folder Structure

```
e:/sport management/
├── backend/
│   ├── database/
│   │   ├── db.js              # Database connection
│   │   └── init.js            # Database initialization
│   ├── routes/
│   │   ├── students.js        # Student API routes
│   │   ├── items.js           # Equipment API routes
│   │   └── transactions.js    # Transaction API routes
│   ├── server.js              # Express server
│   ├── package.json           # Backend dependencies
│   └── sports_management.db   # SQLite database (created after init)
│
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # React pages
│   │   ├── App.js            # Main app
│   │   ├── App.css           # Styles
│   │   ├── index.js          # Entry point
│   │   └── package.json      # Frontend dependencies
│   └── node_modules/         # Frontend packages (created after npm install)
│
├── README.md                  # Project documentation
├── .gitignore                 # Git ignore file
└── SETUP_GUIDE.md            # This file
```

## Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js not installed. Download from https://nodejs.org/

### Problem: Port 3000 already in use
**Solution:** 
- Kill process on port 3000
- Or change port in frontend

### Problem: Port 5000 already in use
**Solution:**
- Kill process on port 5000
- Or edit BACKEND PORT in server.js

### Problem: Database error
**Solution:**
```bash
cd backend
npm run init-db
npm start
```

### Problem: "Module not found" error
**Solution:**
```bash
# Frontend issue
cd frontend
npm install
npm start

# Backend issue
cd backend
npm install
npm start
```

### Problem: CORS error
**Solution:**
- Ensure backend is running on 5000
- Frontend proxy is correct in package.json
- Check CORS middleware in server.js

## Development Workflow

### Starting the Application
1. Open Terminal 1 for Backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Open Terminal 2 for Frontend:
   ```bash
   cd frontend
   npm start
   ```

### Making Changes

**Backend Changes:**
- Edit files in `backend/routes/` or `backend/database/`
- Server auto-reloads with nodemon
- Test with Postman or browser

**Frontend Changes:**
- Edit files in `frontend/src/`
- Browser auto-reloads
- Check console for errors

## API Testing

### Using Postman (Optional)

1. Download: https://www.postman.com/
2. Import collection or create requests
3. Backend URL: http://localhost:5000

### Example Requests

Get all students:
```
GET http://localhost:5000/api/students
```

Add new student:
```
POST http://localhost:5000/api/students
Content-Type: application/json

{
  "name": "John Doe",
  "roll_no": "A001",
  "class": "10A",
  "phone": "9876543210"
}
```

## Production Deployment

### Building Frontend for Production
```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/build/`

### Deployment Options
- Heroku
- Vercel (Frontend)
- AWS
- DigitalOcean
- Netlify

## Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Node.js Documentation](https://nodejs.org/docs)

## Support

For issues:
1. Check error messages in console
2. Review logs in terminal
3. Verify all steps above completed
4. Check database is initialized

## Next Steps

1. Customize the UI theme in `frontend/src/App.css`
2. Add authentication (login/password)
3. Deploy to production server
4. Add more categories for equipment
5. Implement email notifications
6. Add QR code generation

---

**Happy managing your sports equipment! ⚽🏏🎾**
