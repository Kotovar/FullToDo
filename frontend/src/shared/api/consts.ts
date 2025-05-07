export const URL = import.meta.env.VITE_URL;

type ErrorType =
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'UNDEFINED'
  | 'NETWORK_ERROR'
  | 'URL'
  | 'JSON';
type SuccessfulType = 'create' | 'update' | 'delete';
type BaseErrorType = Extract<
  ErrorType,
  'SERVER_ERROR' | 'NETWORK_ERROR' | 'URL' | 'JSON'
>;
type ErrorDetail = {
  type: ErrorType;
  message: string;
};

export const COMMON_ERRORS: Record<BaseErrorType, ErrorDetail> = {
  SERVER_ERROR: {
    type: 'SERVER_ERROR',
    message: 'Некорректные данные',
  },
  NETWORK_ERROR: {
    type: 'NETWORK_ERROR',
    message: 'Сетевая ошибка',
  },
  URL: {
    type: 'URL',
    message: 'VITE_URL is not defined in .env file',
  },
  JSON: {
    type: 'JSON',
    message: 'Unexpected end of JSON input',
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

export const SUCCESSFUL_MESSAGES = {
  tasks: {
    create: 'Задача успешно создана',
    update: 'Задача успешно обновлена',
    delete: 'Задача успешно удалена',
  },
  task: {
    create: 'Подзадача успешно создана',
    update: 'Задача успешно обновлена',
    delete: 'Подзадача успешно удалена',
  },
  notepad: {
    create: 'Блокнот успешно создан',
    update: 'Блокнот успешно переименован',
    delete: 'Блокнот успешно удалён',
  },
} as const;

export const getSuccessMessage = (
  entity: keyof typeof SUCCESSFUL_MESSAGES,
  method: SuccessfulType,
) => SUCCESSFUL_MESSAGES[entity][method];
