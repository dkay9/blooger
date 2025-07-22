// context/ModalContext.js
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <ModalContext.Provider value={{ showLoginModal, setShowLoginModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
