import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { AUTH_STATUS, AuthContext } from '../constants/auth';

const STORAGE_KEY = 'loudkitchen_user_role';
const ROLE_FETCH_TIMEOUT = 10000; // 10 seconds

// Cookie helpers
const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
};

const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(() => getCookie(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY));
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState(AUTH_STATUS.INITIALIZING);
    const [error, setError] = useState(null);

    const roleRef = useRef(role);
    useEffect(() => {
        roleRef.current = role;
        if (role) {
            setCookie(STORAGE_KEY, role);
            localStorage.setItem(STORAGE_KEY, role);
        } else {
            deleteCookie(STORAGE_KEY);
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [role]);

    const fetchUserRole = useCallback(async (userId) => {
        console.log('AuthContext: starting role fetch for', userId);

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Role fetch timed out')), ROLE_FETCH_TIMEOUT)
        );

        try {
            const rolePromise = supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single()
                .then(({ data, error }) => {
                    if (error) throw error;
                    return data?.role || 'user';
                });

            const fetchedRole = await Promise.race([rolePromise, timeoutPromise]);
            console.log('AuthContext: role fetch success:', fetchedRole);
            return fetchedRole;
        } catch (err) {
            console.warn('AuthContext: role fetch failed or timed out, defaulting to user.', err.message);
            return 'user';
        }
    }, []);

    // Fetch the full profile row (name, email, avatar etc)
    const fetchProfile = useCallback(async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email, role, avatar_url')
                .eq('id', userId)
                .single();
            if (!error && data) setProfile(data);
        } catch (_) { }
    }, []);

    useEffect(() => {
        let mounted = true;
        console.log('AuthContext: provider effect mounted');

        const initializeAuth = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (!mounted) return;

                if (sessionError) {
                    setStatus(AUTH_STATUS.UNAUTHENTICATED);
                    return;
                }

                if (session?.user) {
                    setUser(session.user);

                    if (roleRef.current) {
                        setStatus(AUTH_STATUS.AUTHENTICATED);
                        fetchUserRole(session.user.id).then(newRole => { if (mounted) setRole(newRole); });
                        fetchProfile(session.user.id);
                    } else {
                        setStatus(AUTH_STATUS.LOADING_PROFILE);
                        const userRole = await fetchUserRole(session.user.id);
                        if (mounted) {
                            setRole(userRole);
                            setStatus(AUTH_STATUS.AUTHENTICATED);
                            fetchProfile(session.user.id);
                        }
                    }
                } else {
                    deleteCookie(STORAGE_KEY);
                    setRole(null);
                    setProfile(null);
                    setStatus(AUTH_STATUS.UNAUTHENTICATED);
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message);
                    setStatus(AUTH_STATUS.ERROR);
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (session?.user) {
                setUser(session.user);
                if (!roleRef.current) {
                    setStatus(AUTH_STATUS.LOADING_PROFILE);
                    const userRole = await fetchUserRole(session.user.id);
                    if (mounted) {
                        setRole(userRole);
                        setStatus(AUTH_STATUS.AUTHENTICATED);
                        fetchProfile(session.user.id);
                    }
                } else {
                    setStatus(AUTH_STATUS.AUTHENTICATED);
                    fetchUserRole(session.user.id).then(newRole => { if (mounted) setRole(newRole); });
                    fetchProfile(session.user.id);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setRole(null);
                setProfile(null);
                deleteCookie(STORAGE_KEY);
                setStatus(AUTH_STATUS.UNAUTHENTICATED);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchUserRole, fetchProfile]);

    const signIn = async (email, password) => {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        return data;
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('AuthContext: error during Supabase signOut', err);
        } finally {
            setUser(null);
            setRole(null);
            setProfile(null);
            localStorage.removeItem(STORAGE_KEY);
            setStatus(AUTH_STATUS.UNAUTHENTICATED);
        }
    };

    const resendVerificationEmail = async (email) => {
        const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
        if (resendError) throw resendError;
    };

    const refreshProfile = useCallback(() => {
        if (user) fetchProfile(user.id);
    }, [user, fetchProfile]);

    const value = useMemo(() => {
        const userRole = (role || '').toLowerCase().trim();
        return {
            user,
            profile,
            role: userRole,
            status,
            error,
            isLoading: status === AUTH_STATUS.INITIALIZING || status === AUTH_STATUS.LOADING_PROFILE,
            isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
            isAdmin: userRole === 'admin' || userRole === 'superadmin',
            isSuperAdmin: userRole === 'superadmin',
            signIn,
            signOut,
            resendVerificationEmail,
            refreshRole: () => user && fetchUserRole(user.id).then(setRole),
            refreshProfile,
        };
    }, [user, profile, role, status, error, fetchUserRole, refreshProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
