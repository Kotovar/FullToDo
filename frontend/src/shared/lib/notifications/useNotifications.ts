import { toast } from 'react-toastify';

export const useNotifications = () => {
  const showError = (message: string) => {
    toast.error(message);
  };

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  return { showError, showSuccess };
};
