import { createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../api/axios";

const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        data: user,
        isLoading,
        isError,
        refetch: refetchUser,
    } = useQuery({
        queryKey: ["getUser"],
        queryFn: authAPI.getUserDetails,
        retry: false,
        staleTime: 5 * 60 * 1000, // optional, improves UX
    });

    const isAuthPage = location.pathname === "/auth";
    const isAuthenticated = !!user && !isError;

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated && !isAuthPage) {
            navigate("/auth", { replace: true });
            return;
        }

        if (isAuthenticated && isAuthPage) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, isAuthPage, isLoading, navigate]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                isError,
                refetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
