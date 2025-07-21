import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';

const AuthDebugger = () => {
    const { user, isLoading, tokenReady } = useContext(AuthContext);
    
    useEffect(() => {
        const token = localStorage.getItem('access-token');
        console.log('=== Auth Debug ===');
        console.log('User:', user?.email || 'None');
        console.log('Loading:', isLoading);
        console.log('Token Ready:', tokenReady);
        console.log('Token in localStorage:', !!token);
        console.log('Token length:', token?.length || 0);
        console.log('==================');
    }, [user, isLoading, tokenReady]);

    // Don't render anything in production
    return null;
};

export default AuthDebugger;
