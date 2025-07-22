// context/ModalContext.js
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <ModalContext.Provider
      value={{
        showLoginModal,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
