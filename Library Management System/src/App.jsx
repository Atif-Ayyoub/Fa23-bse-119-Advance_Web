import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/AppNavbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BookDetailsPage from './pages/books/BookDetailsPage.jsx';
import BookFormPage from './pages/books/BookFormPage.jsx';
import BooksListPage from './pages/books/BooksListPage.jsx';
import BorrowRecordsPage from './pages/borrowRecords/BorrowRecordsPage.jsx';
import MemberDetailsPage from './pages/members/MemberDetailsPage.jsx';
import MemberFormPage from './pages/members/MemberFormPage.jsx';
import MembersListPage from './pages/members/MembersListPage.jsx';

function App() {
  return (
    <div className="app-shell">
      <AppNavbar />

      <main className="container-fluid py-4 px-3 px-md-4 px-xl-5 page-enter">
        <Routes>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/books" element={<BooksListPage />} />
          <Route path="/books/new" element={<BookFormPage mode="create" />} />
          <Route path="/books/:bookId" element={<BookDetailsPage />} />
          <Route path="/books/:bookId/edit" element={<BookFormPage mode="edit" />} />

          <Route path="/members" element={<MembersListPage />} />
          <Route path="/members/new" element={<MemberFormPage mode="create" />} />
          <Route path="/members/:memberId" element={<MemberDetailsPage />} />
          <Route path="/members/:memberId/edit" element={<MemberFormPage mode="edit" />} />

          <Route path="/borrow-records" element={<BorrowRecordsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
