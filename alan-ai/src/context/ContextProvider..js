import React, { useState, useEffect, createContext } from 'react';

export const addProduct = createContext();

const ContextProvider = ({children}) => {

  const [productData, setProductData] = useState("")

  return (
    <addProduct.Provider value={{ productData, setProductData }}>
      {children}
    </addProduct.Provider>
  );
};

export default ContextProvider;
