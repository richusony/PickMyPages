import axiosInstance from "../axiosConfig";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user')) ?? null;
  const [user, setUser] = useState(storedUser);

  useEffect(() => {
      getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const res = await axiosInstance.get("/get-user");
      setUser(res?.data);
      // console.log("auth :", res?.data?.user);
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  }

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
