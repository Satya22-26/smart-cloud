import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient'; 


interface AuthContextType {
  currentUser: any; 
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // This runs when the app first loads
  useEffect(() => {
    // Check localStorage for a token to keep the user logged in
    const token = localStorage.getItem('session_token');
    const storedUser = localStorage.getItem('user_data');
    if (token && storedUser) {
      setCurrentUser(JSON.parse(storedUser)); 
    } else if (token) {
      setCurrentUser({ token: token }); 
    }
    setLoading(false);
  }, []);

  
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { session } = response.data;
      localStorage.setItem('session_token', session.access_token);
      localStorage.setItem('user_data', JSON.stringify(session.user));
      setCurrentUser(session.user);
      console.log('Login successful:', session);
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    }
  };


  const signup = async (email, password) => {
    try {
      await apiClient.post('/auth/signup', {
        email,
        password,
      });

      await login(email, password);
     
    } catch (error) {
      console.error('Signup failed:', error);
      throw error; 
    }
  };

  
  const logout = async () => {
    try {
      await apiClient.post('/auth/signout');
    } catch (error) {
      console.error("Signout failed", error);
    } finally {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_data');
      setCurrentUser(null);
      navigate('/login');
    }
  };

  
  if (loading) {
    return <div>Loading...</div>; 
  }

  
  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}