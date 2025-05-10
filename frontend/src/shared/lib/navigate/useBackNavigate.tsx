import { useNavigate } from 'react-router';

export const useBackNavigate = () => {
  const navigate = useNavigate();

  return () => navigate(-1);
};
