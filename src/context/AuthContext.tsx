import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthUserApiResponse, UserProfile } from "../types/auth.types";
import type { ApiResponse } from "../types/api.types";
import { authService } from "../services/auth.service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = function ({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<UserProfile|null>(null);
  const [token, setToken] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function () {

      const localToken = localStorage.getItem('access_token');
      const localUser = localStorage.getItem('userProfile');

      if (localToken) {
        try {
          const token = JSON.parse(localToken);
          setToken(token);
        } catch(error) {
          console.error(`Error in fetching access token`, error);
        }
      }

      if (localUser) {
        try {
          const profile:UserProfile = JSON.parse(localUser);
          setUser(profile);
        } catch(error) {
          console.error(`Error in fetching profile`, error);
        }
      }

       setIsLoading(false);
    },
    []
  )

  const login: AuthContextType['login'] = async function (email:string,password:string):Promise<ApiResponse> {
    try {

      const response: AuthUserApiResponse = await authService.login(email, password);
      if (!response.data?.access_token) throw new Error(`Error in logging in`);
      const token = response.data.access_token;
      setToken(response.data.access_token);
      localStorage.setItem('access_token', JSON.stringify(token));

      return { success:response.success, message:response.message }
    } catch (error) {
      console.error(`Error in logging in user`, error)
      return {
        success: false,
        message:`${error}`
      }
    }
  }

  const fetchProfile: AuthContextType['fetchProfile'] = async function (): Promise<UserProfile> {

    try {

      const response = await authService.profile();
      console.log("response", response)
      if (!response.data) throw new Error(`No user data was found`);
      const user = response.data;
      setUser(user);
      localStorage.setItem('userProfile', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error(`Error in fetching profile`, error);
      throw error;
    }

  }

  const logout = function () {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    fetchProfile,
    logout,
    isLoading
  };

  return (
      <AuthContext.Provider value={value}>
        {!isLoading && children}
      </AuthContext.Provider>
    );

}

export const useAuth = function ():AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
