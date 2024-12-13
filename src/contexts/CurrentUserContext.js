import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  const handleMount = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      try {
        const { data } = await axios.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        console.log("Error fetching current user:", err);
      }
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axios.post("/dj-rest-auth/token/refresh/");
        } catch (err) {
          console.log("Token refresh failed:", err);
          setCurrentUser(null);
          history.push("/signin");
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            console.log("Token refresh failed during response handling:", err);
            setCurrentUser(null);
            history.push("/signin");
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    );
  }, [history]);

  const handleLogout = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/", null, {
        withCredentials: true,
      });
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      setCurrentUser(null);
      history.push("/signin");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={{ setCurrentUser, handleLogout }}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
