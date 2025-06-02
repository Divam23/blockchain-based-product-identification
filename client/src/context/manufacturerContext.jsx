// src/context/ManufacturerContext.js
import { createContext, useContext, useState } from "react";

const ManufacturerContext = createContext();

export const ManufacturerProvider = ({ children }) => {
  const [manufacturerData, setManufacturerData] = useState(null);

  return (
    <ManufacturerContext.Provider value={{ manufacturerData, setManufacturerData }}>
      {children}
    </ManufacturerContext.Provider>
  );
};

export const useManufacturer = () => useContext(ManufacturerContext);
