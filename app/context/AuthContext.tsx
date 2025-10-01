import React, { createContext, useContext, useState, useEffect} from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("emailId");

    if (token && userId && email) {
      console.log("Token found:", token);
      fetch("http://localhost:8081/api/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(() => {
        setUser({ id: userId, email });
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.clear();
        setIsLoggedIn(false);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  },[]); 



  const login = async (email: string, password: string) => {
    
    const body = {
      'email': email,
      'password': password,
      'responses':[],
    }
    try {
      
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log(data);

      const jwtToken = data.user.token;
      localStorage.setItem("token", jwtToken);

      const userId = data.user.id;
      localStorage.setItem("userId", userId);

      const emailId = data.user.emailId;
      localStorage.setItem("emailId", emailId);

      setUser({ id: userId, email: emailId });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error; 
    }
  };

  const register = async (email: string, password: string) => {
    const response = await fetch("http://localhost:8081/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  email, password }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    setUser(data.user);

  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("emailId");
    setUser(null);
    setIsLoggedIn(false);
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
