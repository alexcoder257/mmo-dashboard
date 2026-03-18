export const AUTH_API = {
  LOGIN: '/rest/V1/integration/customer/token',
  PROFILE: '/rest/V1/customers/me',
  REFRESH_TOKEN: '/auth/refresh-token',
  REGISTER: '/rest/V1/customers',
} as const;

export const HEALTH_CHECK_API = '/health-check';

export const CATEGORY_API = {
  ATTRIBUTE_SET: '/rest/V1/products/attribute-sets/sets/list?searchCriteria=',
  LIST: '/rest/V1/categories',
} as const;

export const PRODUCT_API = {
  ATTRIBUTES: '/rest/V1/products/attributes',
  DOCUMENTS: '/rest/V1/usa_attachment/list',
  LIST: '/rest/V1/products',
} as const;

export const NEWS_API = {
  DETAIL: '/rest/V1/mpblog/post/view/{postId}',
} as const;

export const GRAPHQL_ENDPOINT = '/graphql';
export const PROFILE_API = {
  CHANGE_PASSWORD: '/rest/V1/customers/me/password',
  CHANGE_USER_NAME: '/rest/V1/customers/me',
  USER_INFO: '/rest/V1/customers/me',
} as const;

export const MISSION_API = {
  DAILY_CHECK_IN: '/rest/V1/mission/dailycheckin',
  DAILY_STATUS: '/rest/V1/mission/dailystatus',
  LIST: '/rest/V1/mission/list',
  REWARDS_AVAILABLE: '/rest/V1/mission/rewards/list',
  REWARDS_EXCHANGE: '/rest/V1/mission/rewards/exchange',
  REWARDS_HISTORY: '/rest/V1/mission/rewards/history',
} as const;

export const ANALYZER_API = {
  UPLOAD: '/api/video/upload',
} as const;

export const TIKTOK_API = {
  DOWNLOAD: '/api/tiktok/download',
} as const;

export const TRAVEL_API = {
  ANALYZE: '/api/travel/analyze',
  JOBS: '/api/travel/jobs',
} as const;

export const CHAT_AI_API = {
  CLOSE: '/rest/V1/ai-chat/session/{sessionToken}/close',
  DELETE_SESSION: '/rest/V1/ai-chat/session/{sessionToken}/delete',
  DISLIKE_MESSAGE: '/rest/V1/ai-chat/message/{messageId}/dislike',
  GENERATE_DOCUMENT:
    '/rest/V1/ai-chat/session/{sessionToken}/generate-document',
  INIT: '/rest/V1/ai-chat/session/start',
  LIKE_MESSAGE: '/rest/V1/ai-chat/message/{messageId}/like',
  LIST_SESSION: '/rest/V1/ai-chat/sessions',
  MESSAGE: '/rest/V1/ai-chat/message',
  REMOVE_INTERACTION: '/rest/V1/ai-chat/message/{messageId}/interaction/remove',
  RENAME_SESSION: '/rest/V1/ai-chat/session/{sessionToken}/rename',
  SESSION_DETAIL: '/rest/V1/ai-chat/session/{sessionToken}/history',
  UPLOAD_FILE: '/rest/V1/ai-chat/session/{sessionToken}/upload',
} as const;
