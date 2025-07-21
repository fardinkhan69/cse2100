import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import { auth, googleProvider } from '@/firebase/firebase.init';
import axios from 'axios';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Start with true until auth state is determined

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
        return signOut(auth);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            console.log('inside useEffect on auth state change', currentUser);
            setUser(currentUser);
            if (currentUser) {
                // get token and store client
                const userInfo = { email: currentUser.email };
                axios.post('http://localhost:5000/jwt', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                            setIsLoading(false);
                        }
                    })
            }
            else {
                // TODO: remove token (if token stored in the client side: Local storage, caching, in memory)
                localStorage.removeItem('access-token');
                setIsLoading(false);
            }
            setIsLoading(false);
        })
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
    }

    return (
        <AuthContext.Provider value={userData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
