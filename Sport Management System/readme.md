# Sports Equipment Management System

A complete web application for managing sports equipment in schools and institutions. Built with React.js frontend and Node.js/Express backend with SQLite database.

## Features

### 1. Student Management
- Add, edit, and delete students
- Auto-generated Student ID
- Search students by name or roll number
- Store student details (name, roll number, class, phone)

### 2. Equipment Management
- Add, edit, and delete sports equipment
- Organize by categories (Cricket, Football, Badminton, etc.)
- Track total and available quantities
- Real-time quantity updates

### 3. Issue Equipment
- Select student and equipment
- Specify quantity and issue date
- Set expected return date
- Automatic quantity deduction

### 4. Return Equipment
- View all active issues
- Process equipment returns
- Automatic quantity restoration
- Late return tracking

### 5. Dashboard
- Real-time statistics
- Total equipment count
- Available equipment count
- Issued equipment count
- Active students count

### 6. Reports & History
- Complete transaction history
- Filter by status (issued/returned)
- Export to CSV
- Track all movements

## Project Structure

```
sport-management/
├── backend/
│   ├── database/
│   │   ├── db.js
│   │   └── init.js
│   ├── routes/
│   │   ├── students.js
│   │   ├── items.js
│   │   └── transactions.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   ├── StudentForm.js
│   │   │   └── ItemForm.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Students.js
│   │   │   ├── Items.js
│   │   │   ├── Issue.js
│   │   │   ├── Return.js
│   │   │   └── Reports.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── package.json
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SQLite 3

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npm run init-db
```

4. Start the backend server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open in `http://localhost:3000`

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/search?query=value` - Search students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats/count` - Get active students count

### Equipment
- `GET /api/items` - Get all equipment
- `GET /api/items/search?query=value` - Search equipment
- `GET /api/items/:id` - Get equipment by ID
- `POST /api/items` - Add new equipment
- `PUT /api/items/:id` - Update equipment
- `DELETE /api/items/:id` - Delete equipment
- `GET /api/items/stats/overview` - Get equipment statistics

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/issued` - Get issued items
- `POST /api/transactions/issue` - Issue equipment
- `POST /api/transactions/return` - Return equipment
- `GET /api/transactions/history/:student_id` - Get student history

## Database Schema

### Students Table
```sql
- id (INTEGER PRIMARY KEY)
- student_id (TEXT UNIQUE)
- name (TEXT)
- roll_no (TEXT UNIQUE)
- class (TEXT)
- phone (TEXT)
- created_at (DATETIME)
```

### Items Table
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- category (TEXT)
- total_quantity (INTEGER)
- available_quantity (INTEGER)
- created_at (DATETIME)
```

### Transactions Table
```sql
- id (INTEGER PRIMARY KEY)
- student_id (INTEGER FOREIGN KEY)
- item_id (INTEGER FOREIGN KEY)
- quantity (INTEGER)
- issue_date (DATETIME)
- return_date (DATETIME)
- status (TEXT - 'issued' or 'returned')
- created_at (DATETIME)
```

## Usage

### Adding a Student
1. Click "Students" in the sidebar
2. Click "Add New Student"
3. Fill in name, roll number, class, and phone
4. Click "Add Student"

### Adding Equipment
1. Click "Equipment" in the sidebar
2. Click "Add New Equipment"
3. Fill in equipment name, category, and quantity
4. Click "Add Equipment"

### Issuing Equipment
1. Click "Issue Items" in the sidebar
2. Select student from dropdown
3. Select equipment from dropdown
4. Enter quantity and dates
5. Click "Issue Equipment"

### Returning Equipment
1. Click "Return Items" in the sidebar
2. Find the item in the active issues list
3. Click "Return" button
4. Equipment quantity will be automatically restored

### Generating Reports
1. Click "Reports" in the sidebar
2. Filter by status if needed
3. Click "Export to CSV" to download transaction history

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios (HTTP client)
- CSS3

### Backend
- Node.js
- Express 4
- SQLite 3
- CORS
- Body Parser

## Future Enhancements

- User authentication and authorization
- Advanced filtering and reporting
- Email notifications for late returns
- Equipment maintenance tracking
- Damage/loss reporting
- Mobile responsive improvements
- Dark mode theme
- Multi-language support
- Barcode/QR code integration

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use, you can change them:
- Backend: Edit `server.js` and change PORT
- Frontend: Set `.env` with `REACT_APP_API_URL`

### Database Issues
If you encounter database errors, delete the `sports_management.db` file and run:
```bash
npm run init-db
```

### CORS Errors
Make sure the backend is running on `http://localhost:5000` and the proxy is correctly set in `frontend/package.json`

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please contact the development team.

---

**Version 1.0.0** - Initial Release
