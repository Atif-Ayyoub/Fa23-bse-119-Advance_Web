# node-mysql-form

Simple Node.js + MySQL form example.

## Requirements
- XAMPP (Apache + MySQL) or a running MySQL server
- Node.js

## Setup
1. Start XAMPP and ensure Apache and MySQL are running.
2. Create the database and table in phpMyAdmin (SQL tab):

```
CREATE DATABASE nodeform;
USE nodeform;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20)
);
```

3. In project folder run:

```powershell
npm install
npm start
```

4. Open http://localhost:3000 and submit the form.

## Files
- `server.js` — Express server and form handler
- `db.js` — MySQL connection
- `public/index.html` — HTML form
