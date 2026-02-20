import { createContext } from 'react';

export const AUTH_STATUS = {
    INITIALIZING: 'INITIALIZING',
    AUTHENTICATED: 'AUTHENTICATED',
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    LOADING_PROFILE: 'LOADING_PROFILE',
    ERROR: 'ERROR'
};

export const AuthContext = createContext(null);
