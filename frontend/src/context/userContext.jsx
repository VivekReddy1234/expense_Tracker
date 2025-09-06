import React from "react";
import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (newUser) => {
    setUser(newUser);
    };

    const clearUser = () => {
      setUser(null);    
    };

  return (
    <UserContext.Provider value={{ user, updateUser,clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;