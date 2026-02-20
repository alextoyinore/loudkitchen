import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [siteSettings, setSiteSettings] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Fetch all data on mount ──────────────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const [menu, blog, staff, gallery, settings] = await Promise.all([
                supabase.from('menu_items').select('*').order('created_at', { ascending: false }),
                supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
                supabase.from('staff').select('*').order('order', { ascending: true }),
                supabase.from('gallery').select('*').order('order', { ascending: true }),
                supabase.from('site_settings').select('*').eq('id', 1).single(),
            ]);

            if (!menu.error) setMenuItems(menu.data ?? []);
            if (!blog.error) setBlogPosts(blog.data ?? []);
            if (!staff.error) setStaffMembers(staff.data ?? []);
            if (!gallery.error) setGalleryItems(gallery.data ?? []);
            if (!settings.error) setSiteSettings(settings.data ?? null);
            setLoading(false);
        };
        fetchAll();
    }, []);

    // ── Menu ─────────────────────────────────────────────────────────────────
    const addMenuItem = async (item) => {
        const { data, error } = await supabase.from('menu_items').insert([item]).select().single();
        if (!error && data) setMenuItems(prev => [data, ...prev]);
        return { data, error };
    };

    const updateMenuItem = async (id, updatedItem) => {
        const { data, error } = await supabase.from('menu_items').update(updatedItem).eq('id', id).select().single();
        if (!error && data) setMenuItems(prev => prev.map(m => m.id === id ? data : m));
        return { data, error };
    };

    const deleteMenuItem = async (id) => {
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if (!error) setMenuItems(prev => prev.filter(m => m.id !== id));
        return { error };
    };

    // ── Blog ─────────────────────────────────────────────────────────────────
    const addBlogPost = async (post) => {
        const { data, error } = await supabase.from('blog_posts').insert([post]).select().single();
        if (!error && data) setBlogPosts(prev => [data, ...prev]);
        return { data, error };
    };

    const updateBlogPost = async (id, updatedPost) => {
        const { data, error } = await supabase.from('blog_posts').update(updatedPost).eq('id', id).select().single();
        if (!error && data) setBlogPosts(prev => prev.map(p => p.id === id ? data : p));
        return { data, error };
    };

    const deleteBlogPost = async (id) => {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (!error) setBlogPosts(prev => prev.filter(p => p.id !== id));
        return { error };
    };

    // ── Staff ─────────────────────────────────────────────────────────────────
    const addStaffMember = async (member) => {
        const { data, error } = await supabase.from('staff').insert([member]).select().single();
        if (!error && data) setStaffMembers(prev => [...prev, data]);
        return { data, error };
    };

    const updateStaffMember = async (id, updatedMember) => {
        const { data, error } = await supabase.from('staff').update(updatedMember).eq('id', id).select().single();
        if (!error && data) setStaffMembers(prev => prev.map(s => s.id === id ? data : s));
        return { data, error };
    };

    const deleteStaffMember = async (id) => {
        const { error } = await supabase.from('staff').delete().eq('id', id);
        if (!error) setStaffMembers(prev => prev.filter(s => s.id !== id));
        return { error };
    };

    // ── Gallery ───────────────────────────────────────────────────────────────
    const addGalleryItem = async (item) => {
        const { data, error } = await supabase.from('gallery').insert([item]).select().single();
        if (!error && data) setGalleryItems(prev => [...prev, data]);
        return { data, error };
    };

    const deleteGalleryItem = async (id) => {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (!error) setGalleryItems(prev => prev.filter(g => g.id !== id));
        return { error };
    };

    // ── Settings ──────────────────────────────────────────────────────────────
    const updateSettings = async (newSettings) => {
        const { data, error } = await supabase
            .from('site_settings')
            .upsert({
                id: 1,
                ...newSettings,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        if (!error && data) setSiteSettings(data);
        return { data, error };
    };

    // ── Bookings ──────────────────────────────────────────────────────────────
    const addBooking = async (booking) => {
        const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
        if (!error && data) setBookings(prev => [data, ...prev]);
        return { data, error };
    };

    const fetchBookings = async () => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setBookings(data ?? []);
        return { data, error };
    };

    return (
        <DataContext.Provider value={{
            loading,
            siteSettings,
            menuItems,
            blogPosts,
            staffMembers,
            galleryItems,
            bookings,
            // Menu
            addMenuItem,
            updateMenuItem,
            deleteMenuItem,
            // Blog
            addBlogPost,
            updateBlogPost,
            deleteBlogPost,
            // Staff
            addStaffMember,
            updateStaffMember,
            deleteStaffMember,
            // Gallery
            addGalleryItem,
            deleteGalleryItem,
            // Settings
            updateSettings,
            // Bookings
            addBooking,
            fetchBookings,
        }}>
            {children}
        </DataContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
    return useContext(DataContext);
}
