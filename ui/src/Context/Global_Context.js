import React, { createContext, useState, useEffect } from "react";

const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
  // Load data from local storage when the component mounts
  const initialToken = localStorage.getItem("token") || "";
  const initialUser = JSON.parse(localStorage.getItem("user")) || {};


  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

    // Update local storage whenever state changes
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <GlobalStateContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateContext, GlobalStateProvider };
