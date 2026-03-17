export const AUTH_PAGE = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ROOT: '/auth',
} as const;

export const CATEGORY_PAGE = '/category?id={id}';
export const CODEBASE_PAGE = '/codebase';
export const FORBIDDEN_PAGE = '/forbidden';
export const HOME_PAGE = '/';
export const NOT_FOUND_PAGE = '/not-found';
export const DAILY_MISSIONS_PAGE = '/dailymissions';
export const PRODUCT_DETAIL_PAGE = '/product/{id}';
export const SETTINGS_PAGE = '/settings';
export const DASHBOARD_PAGE = '/dashboard';
export const AI_ASSISTANT_PAGE = '/ai-assistant';
export const ABOUT_PAGE = '/about';
export const TERMS_PAGE = '/terms';

export const NEWS_PAGE = {
  DETAIL: '/news/{id}',
  ROOT: '/news',
} as const;

export const PROFILE_PAGE = {
  CHANGE_PASSWORD: '/profile/change-password',
  ROOT: '/profile',
} as const;

export const BLOG_PAGE = {
  DETAIL: '/blog/{id}',
  ROOT: '/blog',
} as const;
