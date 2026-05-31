import { AuthContext, AuthContextValue } from "@/components/AuthProvider";
import { useContext } from "react";

const useAuth = (): AuthContextValue => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return auth;
};

export default useAuth;
