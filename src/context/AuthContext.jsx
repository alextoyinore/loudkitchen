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
    const [status, setStatus] = useState(AUTH_STATUS.INITIALIZING);
    const [error, setError] = useState(null);

    // Use a ref to track the current role for the listener without triggering re-runs
    const roleRef = useRef(role);
    useEffect(() => {
        roleRef.current = role;
        if (role) {
            setCookie(STORAGE_KEY, role);
            localStorage.setItem(STORAGE_KEY, role); // Keep localStorage as backup
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

    useEffect(() => {
        let mounted = true;
        console.log('AuthContext: provider effect mounted');

        const initializeAuth = async () => {
            try {
                console.log('AuthContext: initializing session check');
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (!mounted) return;

                if (sessionError) {
                    console.error('AuthContext: session error', sessionError);
                    setStatus(AUTH_STATUS.UNAUTHENTICATED);
                    return;
                }

                if (session?.user) {
                    console.log('AuthContext: session found for', session.user.email);
                    setUser(session.user);

                    if (roleRef.current) {
                        console.log('AuthContext: using cached role', roleRef.current);
                        // If we have a role, we are authenticated. Don't block with loading.
                        setStatus(AUTH_STATUS.AUTHENTICATED);
                        // Background refresh without changing status
                        fetchUserRole(session.user.id).then(newRole => {
                            if (mounted) {
                                console.log('AuthContext: background role update:', newRole);
                                setRole(newRole);
                            }
                        });
                    } else {
                        setStatus(AUTH_STATUS.LOADING_PROFILE);
                        const userRole = await fetchUserRole(session.user.id);
                        if (mounted) {
                            setRole(userRole);
                            setStatus(AUTH_STATUS.AUTHENTICATED);
                        }
                    }
                } else {
                    console.log('AuthContext: no session found');
                    deleteCookie(STORAGE_KEY);
                    setRole(null);
                    setStatus(AUTH_STATUS.UNAUTHENTICATED);
                }
            } catch (err) {
                console.error('AuthContext: initialization failure:', err);
                if (mounted) {
                    setError(err.message);
                    setStatus(AUTH_STATUS.ERROR);
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            console.log('AuthContext: auth state change:', event, session?.user?.email);

            if (session?.user) {
                setUser(session.user);
                // Only set internal status to LOADING_PROFILE if we don't have a role yet
                if (!roleRef.current) {
                    setStatus(AUTH_STATUS.LOADING_PROFILE);
                    const userRole = await fetchUserRole(session.user.id);
                    if (mounted) {
                        setRole(userRole);
                        setStatus(AUTH_STATUS.AUTHENTICATED);
                    }
                } else {
                    setStatus(AUTH_STATUS.AUTHENTICATED);
                    // Background refresh
                    fetchUserRole(session.user.id).then(newRole => {
                        if (mounted) setRole(newRole);
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setRole(null);
                deleteCookie(STORAGE_KEY);
                setStatus(AUTH_STATUS.UNAUTHENTICATED);
            }
        });

        return () => {
            mounted = false;
            console.log('AuthContext: provider effect unmounting');
            subscription.unsubscribe();
        };
    }, [fetchUserRole]);

    const signIn = async (email, password) => {
        console.log('AuthContext: calling signIn');
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        return data;
    };

    const signOut = async () => {
        console.log('AuthContext: calling signOut');
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('AuthContext: error during Supabase signOut', err);
        } finally {
            // Always clear local state even if network call fails
            console.log('AuthContext: clearing local auth state');
            setUser(null);
            setRole(null);
            localStorage.removeItem(STORAGE_KEY);
            setStatus(AUTH_STATUS.UNAUTHENTICATED);
        }
    };

    const value = useMemo(() => {
        const userRole = (role || '').toLowerCase().trim();
        return {
            user,
            role: userRole,
            status,
            error,
            isLoading: status === AUTH_STATUS.INITIALIZING || status === AUTH_STATUS.LOADING_PROFILE,
            isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
            isAdmin: userRole === 'admin' || userRole === 'superadmin',
            isSuperAdmin: userRole === 'superadmin',
            signIn,
            signOut,
            refreshRole: () => user && fetchUserRole(user.id).then(setRole)
        };
    }, [user, role, status, error, fetchUserRole]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
