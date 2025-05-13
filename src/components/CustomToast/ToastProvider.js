import React, { createContext, useRef } from 'react';
import CustomToast from './CustomToastHOC';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toastRef = useRef();

  return (
    <ToastContext.Provider value={toastRef}>
      {children}
      <CustomToast ref={toastRef} />
    </ToastContext.Provider>
  );
};
