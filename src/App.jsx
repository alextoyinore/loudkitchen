import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Book from './pages/Book';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import DishDetail from './pages/DishDetail';
import Staff from './pages/Staff';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import MenuEditor from './pages/admin/MenuEditor';
import BlogEditor from './pages/admin/BlogEditor';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="menu/:id" element={<DishDetail />} />
        <Route path="book" element={<Book />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="staff" element={<Staff />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuEditor />} />
        <Route path="blog" element={<BlogEditor />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
