import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import { auth, googleProvider } from '@/firebase/firebase.init';
import axios from 'axios';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Start with true until auth state is determined
    const [tokenReady, setTokenReady] = useState(false); // Track if token is ready

    // Simple wrapper functions that only return Firebase auth functions
    const createUser = async (email: string, password: string) => {
        setIsLoading(true);
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = async (email: string, password: string) => {
        setIsLoading(true);
        return await signInWithEmailAndPassword(auth, email, password);
    }

    const signInWithGoogle = async () => {
        setIsLoading(true);
        return await signInWithPopup(auth, googleProvider);
    }

    const signOutUser = () => {
        setIsLoading(true);
        setTokenReady(false);
        return signOut(auth);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('Auth state changed:', currentUser?.email || 'No user');
            setUser(currentUser);
            
            if (currentUser) {
                // Keep loading true while getting JWT token
                console.log('Getting JWT token for user:', currentUser.email);
                const userInfo = { email: currentUser.email };
                
                try {
                    const res = await axios.post('http://localhost:5000/jwt', userInfo);
                    console.log('JWT response:', res.data);
                    
                    if (res.data.token) {
                        localStorage.setItem('access-token', res.data.token);
                        console.log('Token stored successfully');
                        setTokenReady(true); // Mark token as ready
                        
                        // Small delay to ensure token is fully available
                        await new Promise(resolve => setTimeout(resolve, 200));
                    } else {
                        console.error('No token received from server');
                        setTokenReady(false);
                    }
                } catch (error) {
                    console.error('Error getting JWT token:', error);
                    // If JWT request fails, set tokenReady to true to prevent infinite waiting
                    // but don't sign out the user - they're still authenticated with Firebase
                    setTokenReady(true);
                } finally {
                    // Always stop loading, regardless of JWT success/failure
                    setIsLoading(false);
                }
            } else {
                // User signed out - remove token and stop loading
                console.log('User signed out, removing token');
                localStorage.removeItem('access-token');
                setTokenReady(false); // No token when no user
                setIsLoading(false);
            }
        });
        
        return () => {
            unSubscribe();
        }
    }, [])

    const userData = {
        user,
        setUser,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        isLoading,
        setIsLoading,
        tokenReady, // Add token ready state
    }

    return (
        <AuthContext.Provider value={userData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
