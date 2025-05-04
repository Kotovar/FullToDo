export const URL = import.meta.env.VITE_URL;
export const ERRORS = {
  url: 'VITE_URL is not defined in .env file',
  fetch: 'fetch failed',
  json: 'Unexpected end of JSON input',
  server: 'Server error',
} as const;

type ErrorType = 'CONFLICT' | 'SERVER_ERROR' | 'UNDEFINED' | 'NETWORK_ERROR';
type SuccessfulType = 'create' | 'update' | 'delete';
type BaseErrorType = Extract<ErrorType, 'SERVER_ERROR' | 'NETWORK_ERROR'>;
type ErrorDetail = {
  type: ErrorType;
  message: string;
};

const COMMON_ERRORS: Record<BaseErrorType, ErrorDetail> = {
  SERVER_ERROR: {
    type: 'SERVER_ERROR',
    message: 'Некорректные данные',
  },
  NETWORK_ERROR: {
    type: 'NETWORK_ERROR',
    message: 'Сетевая ошибка',
  },
};

export const NOTEPAD_ERRORS: Record<ErrorType, ErrorDetail> = {
  CONFLICT: {
    type: 'CONFLICT',
    message: 'Блокнот с таким названием уже существует',
  },
  UNDEFINED: {
    type: 'UNDEFINED',
    message: 'Такой блокнот не найден или был выбран системный блокнот',
  },
  ...COMMON_ERRORS,
};

export const TASKS_ERRORS: Record<ErrorType, ErrorDetail> = {
  CONFLICT: {
    type: 'CONFLICT',
    message: 'Задача с таким названием уже существует',
  },
  UNDEFINED: {
    type: 'UNDEFINED',
    message: 'Такой блокнот не найден',
  },
  ...COMMON_ERRORS,
};

export const TASKS_SUCCESSFUL_MESSAGES: Record<SuccessfulType, string> = {
  create: 'Задача успешно создана',
  update: 'Задача успешно обновлена',
  delete: 'Задача успешно удалена',
};

export const NOTEPAD_SUCCESSFUL_MESSAGES: Record<SuccessfulType, string> = {
  create: 'Блокнот успешно создан',
  update: 'Блокнот успешно переименован',
  delete: 'Блокнот успешно удалён',
};
