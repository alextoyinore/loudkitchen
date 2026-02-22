import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

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
import Reviews from './pages/Reviews';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import Dashboard from './pages/admin/Dashboard';
import MenuEditor from './pages/admin/MenuEditor';
import BlogEditor from './pages/admin/BlogEditor';
import StaffEditor from './pages/admin/StaffEditor';
import GalleryEditor from './pages/admin/GalleryEditor';
import Bookings from './pages/admin/Bookings';
import UsersManager from './pages/admin/UsersManager';
import Settings from './pages/admin/Settings';
import ReviewManager from './pages/admin/ReviewManager';
import OrderManager from './pages/admin/OrderManager';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="menu/:id" element={<DishDetail />} />
        {/* <Route path="book" element={<Book />} /> */}
        {/* <Route path="gallery" element={<Gallery />} /> */}
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="staff" element={<Staff />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* Admin Login & Signup (public) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* Admin Routes (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuEditor />} />
        <Route path="blog" element={<BlogEditor />} />
        <Route path="staff" element={<StaffEditor />} />
        <Route path="gallery" element={<GalleryEditor />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="users" element={<ProtectedRoute superAdminOnly={true}><UsersManager /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute superAdminOnly={true}><Settings /></ProtectedRoute>} />
        <Route path="reviews" element={<ReviewManager />} />
        <Route path="orders" element={<OrderManager />} />
      </Route>
    </Routes>
  );
}

export default App;
