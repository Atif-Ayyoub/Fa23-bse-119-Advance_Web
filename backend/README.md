# Backend - Sports Equipment Management System

Express.js REST API for the Sports Equipment Management System.

## Quick Start

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Start server
npm start

# Development mode with auto-reload
npm run dev
```

Server runs on `http://localhost:5000`

## API Documentation

### Students Endpoints

#### Get All Students
```http
GET /api/students
```

#### Search Students
```http
GET /api/students/search?query=search_term
```

#### Get Student by ID
```http
GET /api/students/:id
```

#### Add New Student
```http
POST /api/students
Content-Type: application/json

{
  "name": "John Doe",
  "roll_no": "A001",
  "class": "10A",
  "phone": "9876543210"
}
```

#### Update Student
```http
PUT /api/students/:id
Content-Type: application/json

{
  "name": "John Doe",
  "roll_no": "A001",
  "class": "10A",
  "phone": "9876543210"
}
```

#### Delete Student
```http
DELETE /api/students/:id
```

#### Get Active Students Count
```http
GET /api/students/stats/count
```

### Equipment Endpoints

#### Get All Equipment
```http
GET /api/items
```

#### Search Equipment
```http
GET /api/items/search?query=search_term
```

#### Get Equipment by ID
```http
GET /api/items/:id
```

#### Add New Equipment
```http
POST /api/items
Content-Type: application/json

{
  "name": "Cricket Bat",
  "category": "Cricket",
  "total_quantity": 10
}
```

#### Update Equipment
```http
PUT /api/items/:id
Content-Type: application/json

{
  "name": "Cricket Bat",
  "category": "Cricket",
  "total_quantity": 10
}
```

#### Delete Equipment
```http
DELETE /api/items/:id
```

#### Get Equipment Statistics
```http
GET /api/items/stats/overview
```

Returns:
```json
{
  "totalItems": 50,
  "availableItems": 45,
  "issuedItems": 5
}
```

### Transactions Endpoints

#### Get All Transactions
```http
GET /api/transactions
```

#### Get Issued Items
```http
GET /api/transactions/issued
```

#### Issue Equipment
```http
POST /api/transactions/issue
Content-Type: application/json

{
  "student_id": 1,
  "item_id": 1,
  "quantity": 2,
  "issue_date": "2024-03-29",
  "expected_return_date": "2024-04-05"
}
```

#### Return Equipment
```http
POST /api/transactions/return
Content-Type: application/json

{
  "transaction_id": 1,
  "return_date": "2024-04-02"
}
```

#### Get Student Transaction History
```http
GET /api/transactions/history/:student_id
```

## Database

SQLite database file: `database/sports_management.db`

### Tables

**students** - Student information
**items** - Equipment inventory
**transactions** - Issue and return records

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error Response Example:
```json
{
  "error": "Description of the error"
}
```

## Dependencies

- express@4.18.2 - Web framework
- sqlite3@5.1.6 - Database
- cors@2.8.5 - CORS middleware
- body-parser@1.20.2 - Body parsing middleware
- uuid@9.0.0 - UUID generation

## Development

```bash
# Install dev dependencies with nodemon for auto-reload
npm install --save-dev nodemon

# Run in dev mode
npm run dev
```

## Features

- RESTful API design
- SQLite database with foreign key constraints
- CORS support for cross-origin requests
- Input validation
- Error handling
- Auto-generated IDs and timestamps
- Real-time quantity updates
- Transaction history tracking
