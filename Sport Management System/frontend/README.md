# Frontend - Sports Equipment Management System

React.js web application for the Sports Equipment Management System.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Application opens on `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Navbar.js         # Top navigation bar
│   ├── Sidebar.js        # Side navigation menu
│   ├── StudentForm.js    # Student add/edit form
│   └── ItemForm.js       # Equipment add/edit form
│
├── pages/
│   ├── Dashboard.js      # Main dashboard with statistics
│   ├── Students.js       # Student management page
│   ├── Items.js          # Equipment management page
│   ├── Issue.js          # Issue equipment page
│   ├── Return.js         # Return equipment page
│   └── Reports.js        # Reports and history page
│
├── App.js                # Main app component with routing
├── App.css               # Global styles
├── index.js              # React entry point
└── package.json          # Dependencies and scripts
```

## Pages Description

### Dashboard
- Displays key statistics
- Total equipment count
- Available equipment count
- Issued equipment count
- Active students count

### Students Management
- Add new students
- Edit student information
- Delete students
- Search students by name or roll number
- View all students in table format

### Equipment Management
- Add new equipment
- Edit equipment details
- Delete equipment
- Search by name or category
- View inventory status (total, available, issued)

### Issue Equipment
- Select student from dropdown
- Select equipment from dropdown
- Specify quantity to issue
- Set issue and expected return dates
- Real-time validation

### Return Equipment
- View all active issues
- Return equipment with one click
- Automatic quantity restoration
- Late return indicator

### Reports
- View complete transaction history
- Filter by status (Issued/Returned/All)
- Export data to CSV
- Summary statistics

## Components

### Navbar
Top navigation bar with:
- Toggle sidebar button
- Application title
- Current date display

### Sidebar
Navigation menu with links to:
- Dashboard
- Students
- Equipment
- Issue Items
- Return Items
- Reports

### StudentForm
Form component for adding/editing students:
- Name input
- Roll number input
- Class input
- Phone input
- Auto-generated Student ID

### ItemForm
Form component for adding/editing equipment:
- Equipment name input
- Category dropdown
- Total quantity input
- Auto-calculated available quantity

## Styling

CSS is organized in `App.css` with classes for:
- Layout components (navbar, sidebar, main)
- Dashboard cards
- Forms and inputs
- Tables
- Alerts and messages
- Modal dialogs
- Responsive design

## Available Scripts

```bash
# Development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (not reversible)
npm eject
```

## Dependencies

- react@18.2.0 - UI library
- react-dom@18.2.0 - React DOM rendering
- react-router-dom@6.8.0 - Client-side routing
- axios@1.3.2 - HTTP client
- date-fns@2.29.2 - Date utilities

## Features

- Responsive design (desktop and tablet)
- Form validation
- Real-time data updates
- Search and filter functionality
- Data export to CSV
- Error handling and messages
- Loading states
- Confirmation dialogs for delete operations

## API Integration

API calls are made using Axios to the backend server at `http://localhost:5000` (configured in package.json proxy).

### Example API Call

```javascript
const response = await axios.get('/api/students');
const students = response.data;
```

## Styling Guide

### Colors
- Primary: #2980b9 (Blue)
- Success: #27ae60 (Green)
- Warning: #f39c12 (Orange)
- Danger: #e74c3c (Red)
- Background: #f5f5f5 (Light Gray)
- Text: #2c3e50 (Dark Blue-Gray)

### Responsive Breakpoints
- Desktop: Full width
- Tablet: Adjusted padding and font sizes
- Mobile: Single column layout, hidden sidebar

## Common Tasks

### Adding a New Page

1. Create a new file in `src/pages/`
2. Import in `App.js`
3. Add route in `App.js` Routes component
4. Add menu item in `Sidebar.js`

### Adding a New Component

1. Create a new file in `src/components/`
2. Export the component
3. Import and use in pages or other components

### Styling a Component

1. Add CSS classes to elements
2. Define styles in `App.css`
3. Use class names in component

## Troubleshooting

### Backend not connecting
- Ensure backend is running on localhost:5000
- Check CORS settings in backend
- Verify proxy in package.json

### Data not updating
- Check browser console for errors
- Verify API endpoints are correct
- Ensure backend database is initialized

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server
- Check CSS file is loaded

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Environment Configuration

Create `.env` file to configure:
```
REACT_APP_API_URL=http://localhost:5000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
