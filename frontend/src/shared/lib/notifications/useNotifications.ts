import { toast } from 'react-toastify';

export const useNotifications = () => {
  const showError = (message: string) => {
    toast.error(message, {
      toastId: 'error',
    });
  };

  const showSuccess = (message: string) => {
    toast.success(message, {
      toastId: 'success',
    });
  };

  const showInfo = (message: string) => {
    toast.info(message, {
      toastId: 'info',
    });
  };

  return { showError, showSuccess, showInfo };
};
