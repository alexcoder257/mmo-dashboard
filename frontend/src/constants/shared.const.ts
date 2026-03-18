export const ERROR_CODES = {
  ERR_500: 'ERR_500',
} as const;

export const NODE_ENVS = {
  DEVELOP: 'develop',
  PRODUCTION: 'production',
  STAGING: 'staging',
  TESTING: 'testing',
} as const;

export const REGEXES = {
  ALPHA_NUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABET: /^[a-zA-Z]+$/,
  DATE: /^(19|20)\d\d[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])$/,
  DISPLAY_NAME: /^[a-zA-Z\s]+$/,
  EMAIL: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  IP_ADDRESS:
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  TIME: /^([01]\d|2[0-3]):([0-5]\d)$/,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?$/,
  USERNAME: /^[a-zA-Z0-9_]{3,16}$/,
} as const;

export const SELECTORS = {
  APIS_SECTION: 'apis-section',
  LOGIN_SECTION: 'login-section',
  REGISTER_SECTION: 'register-section',
} as const;

export const STORAGE_KEYS = {
  LANGUAGE: 'n_language',
  REMEMBER_USERNAME: 'n_remember_username',
  THEME: 'n_theme',
} as const;

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'N_ACCESS_TOKEN',
  CHAT_TOKEN: 'CHAT_TOKEN',
  LANGUAGE: 'N_LANGUAGE',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
} as const;

export const BREAK_POINT_MOBILE = 640;
export const BREAK_POINT_TABLET = 1024;

export const MODAL_KEYS = {
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  COMPARE_MODAL: 'COMPARE_MODAL',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  SEARCH_MODAL: 'SEARCH_MODAL',
} as const;

export const DEBOUNCE_TIME = 300;

export const DEFAULT_PAGE_SIZE = 5;

export const MEDIA_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/pub/media`;

export const SUPPORTED_FILE_EXTENSIONS = [
  'pdf',
  'txt',
  'text',
  'md',
  'csv',
  'log',
  'docx',
  'doc',
];
