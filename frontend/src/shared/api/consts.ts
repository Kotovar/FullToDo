export const URL = import.meta.env.VITE_URL;
export const ERRORS = {
  url: 'VITE_URL is not defined in .env file',
  network: 'Network response was not ok',
} as const;
