import { createContext, useState, useEffect, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("auth_token") || null);
    const [loading, setLoading] = useState(true);
    const { transitionUser } = useCart();
    const toast = useToast();

    useEffect(() => {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("auth_user", JSON.stringify(data.user));

                // Transition cart from guest to user
                if (transitionUser) {
                    await transitionUser(data.user.id);
                }

                toast({
                    title: "Login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                return { success: true, user: data.user };
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return { success: false, error: error.message };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await fetch("http://localhost:3000/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            const data = await res.json();

            if (res.ok) {
                toast({
                    title: "Sign up successful",
                    description: "You can now log in.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                return { success: true };
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        toast({
            title: "Logged out",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
