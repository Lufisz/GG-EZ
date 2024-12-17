import React from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

// Create context for storing the current user and providing setCurrentUser functions
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks for accessing current user and the function to set user state
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Provider component for managing the current user state
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  // Handle user logout by clearing tokens and user state
  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setCurrentUser(null);
      history.push("/signin");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }, [history]);

  // Fetch the current user's role from the backend
  const fetchCurrentUserRole = useCallback(async () => {
    try {
      const { data } = await axios.get("users/current-user-role/");
      setCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching user role:", err);
      handleLogout();
    }
  }, [handleLogout]);

  // Fetch the current user data when the component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("/dj-rest-auth/user/");
        setCurrentUser(data);
        fetchCurrentUserRole();
      } catch (err) {
        console.log("Error fetching current user:", err);
        handleLogout();
      }
    };

    fetchCurrentUser();
  }, [handleLogout, fetchCurrentUserRole]);

  // Axios interceptor to handle expired access tokens (401 errors)
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            // Attempt to refresh the access token using the refresh token
            const { data } = await axios.post("/dj-rest-auth/token/refresh/", {
              refresh: localStorage.getItem("refreshToken"),
            });
            const newAccessToken = data.access;
            localStorage.setItem("accessToken", newAccessToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(error.config);
          } catch (refreshError) {
            console.log("Token refresh failed:", refreshError);
            handleLogout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [handleLogout]);

  // Provide currentUser state and setCurrentUser functions to children components
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={{ setCurrentUser, handleLogout }}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
