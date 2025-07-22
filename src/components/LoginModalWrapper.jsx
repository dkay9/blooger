import { useModal } from "../context/ModalContext";
import LoginModal from "./LoginModal";

export default function LoginModalWrapper() {
  const { showLoginModal, closeLoginModal } = useModal();

  if (!showLoginModal) return null;

  return <LoginModal onClose={closeLoginModal} />;
}
