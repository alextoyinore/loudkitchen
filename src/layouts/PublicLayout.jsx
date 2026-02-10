import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';

const PublicLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div
            className="min-h-screen flex flex-col bg-primary"
            style={{
                paddingLeft: isHome ? '0' : 'var(--page-margin)',
                paddingRight: isHome ? '0' : 'var(--page-margin)'
            }}
        >
            <div className="flex-1 flex flex-col bg-primary relative">
                <Navbar />
                <main style={{ flex: 1, paddingTop: isHome ? '0' : '80px' }}> {/* Padding top to clear fixed navbar, except on home */}
                    <Outlet />
                </main>
                <CallToAction />
                <Footer />
            </div>
        </div>
    );
};

export default PublicLayout;
