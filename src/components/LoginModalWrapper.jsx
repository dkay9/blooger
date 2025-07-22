// components/LoginModalWrapper.jsx
import { useModal } from '../context/ModalContext';
import LoginModal from './LoginModal';

export default function LoginModalWrapper() {
  const { showLoginModal, setShowLoginModal } = useModal();

  if (!showLoginModal) return null;

  return <LoginModal onClose={() => setShowLoginModal(false)} />;
}
