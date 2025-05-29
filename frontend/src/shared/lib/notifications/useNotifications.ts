import { toast } from 'react-toastify';

export const useNotifications = () => {
  const showError = (message: string) => {
    toast.error(message);
  };

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showInfo = (message: string) => {
    toast.info(message);
  };

  return { showError, showSuccess, showInfo };
};
