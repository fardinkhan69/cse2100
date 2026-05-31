import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential, sendPasswordResetEmail } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import { auth, googleProvider } from '@/firebase/firebase.init';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

/**
 * AuthContext type definition for type safety across the app
 */
export interface AuthContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    createUser: (email: string, password: string) => Promise<UserCredential>;
    signInUser: (email: string, password: string) => Promise<UserCredential>;
    signInWithGoogle: () => Promise<UserCredential>;
    signOutUser: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    tokenReady: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [tokenReady, setTokenReady] = useState(false);

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

    const signOutUser = async () => {
        setIsLoading(true);
        setTokenReady(false);
        await signOut(auth);
    }

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Send Firebase ID token (not bare email) for secure JWT exchange
                try {
                    const idToken = await currentUser.getIdToken();
                    const res = await axios.post(`${API_BASE_URL}/jwt`, {
                        email: currentUser.email,
                        idToken: idToken,
                    });
                    
                    if (res.data.token) {
                        localStorage.setItem('access-token', res.data.token);
                        setTokenReady(true);
                    } else {
                        setTokenReady(false);
                    }
                } catch (error) {
                    // JWT request failed — don't mark token as ready
                    // User can still navigate public routes; secured API calls will fail gracefully
                    setTokenReady(false);
                } finally {
                    setIsLoading(false);
                }
            } else {
                localStorage.removeItem('access-token');
                setTokenReady(false);
                setIsLoading(false);
            }
        });
        
        return () => {
            unSubscribe();
        }
    }, [])

    const userData: AuthContextValue = {
        user,
        setUser,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        resetPassword,
        isLoading,
        setIsLoading,
        tokenReady,
    }

    return (
        <AuthContext.Provider value={userData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
