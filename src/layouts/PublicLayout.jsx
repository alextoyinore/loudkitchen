import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';

const PublicLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main style={{ flex: 1, paddingTop: isHome ? '0' : '80px' }}> {/* Padding top to clear fixed navbar, except on home */}
                <Outlet />
            </main>
            <CallToAction />
            <Footer />
        </div>
    );
};

export default PublicLayout;
