import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setCurrentUser(null);
      history.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }, [history]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        console.log("Error fetching current user:", err);
        handleLogout();
      }
    };

    fetchCurrentUser();
  }, [handleLogout]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
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

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [handleLogout]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={{ setCurrentUser, handleLogout }}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
