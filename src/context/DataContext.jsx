import React, { createContext, useState, useContext } from 'react';
import { mockData } from '../data/mockData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [siteSettings, setSiteSettings] = useState(mockData.siteSettings);
    const [menuItems, setMenuItems] = useState(mockData.menuItems);
    const [blogPosts, setBlogPosts] = useState(mockData.blogPosts);
    const [staffMembers, setStaffMembers] = useState(mockData.staffMembers);
    const [bookings, setBookings] = useState(mockData.bookings);

    // Actions
    const addMenuItem = (item) => {
        setMenuItems([...menuItems, { ...item, id: Date.now() }]);
    };

    const updateMenuItem = (id, updatedItem) => {
        setMenuItems(menuItems.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    };

    const deleteMenuItem = (id) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const addBlogPost = (post) => {
        setBlogPosts([...blogPosts, { ...post, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    };

    const updateSettings = (newSettings) => {
        setSiteSettings({ ...siteSettings, ...newSettings });
    };

    const addBooking = (booking) => {
        // In a real app, this would send an email
        console.log("Booking Request:", booking);
        alert(`Booking request received for ${booking.name}. Check console for details.`);
        setBookings([...bookings, { ...booking, id: Date.now(), status: 'pending' }]);
    };

    return (
        <DataContext.Provider value={{
            siteSettings,
            menuItems,
            blogPosts,
            staffMembers,
            bookings,
            addMenuItem,
            updateMenuItem,
            deleteMenuItem,
            addBlogPost,
            updateSettings,
            addBooking
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
