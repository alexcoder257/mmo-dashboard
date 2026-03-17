import { EAuthRole } from '@/models/enums/auth.enum';

import {
  ABOUT_PAGE,
  AUTH_PAGE,
  BLOG_PAGE,
  DAILY_MISSIONS_PAGE,
  HOME_PAGE,
  NEWS_PAGE,
  PROFILE_PAGE,
  TERMS_PAGE,
} from './route-pages.const';

interface IRouteGuard {
  requiresAuth: boolean;
  roles: EAuthRole[];
}

export const ROUTE_GUARDS: Record<string, IRouteGuard> = {
  [ABOUT_PAGE]: {
    requiresAuth: false,
    roles: [],
  },

  [AUTH_PAGE.ROOT]: {
    requiresAuth: false,
    roles: [],
  },

  [BLOG_PAGE.ROOT]: {
    requiresAuth: false,
    roles: [],
  },

  [DAILY_MISSIONS_PAGE]: {
    requiresAuth: true,
    roles: [
      EAuthRole.Admin,
      EAuthRole.Moderator,
      EAuthRole.SuperAdmin,
      EAuthRole.User,
    ],
  },

  [HOME_PAGE]: {
    requiresAuth: true,
    roles: [],
  },

  [NEWS_PAGE.ROOT]: {
    requiresAuth: true,
    roles: [
      EAuthRole.Admin,
      EAuthRole.Moderator,
      EAuthRole.SuperAdmin,
      EAuthRole.User,
    ],
  },

  [PROFILE_PAGE.ROOT]: {
    requiresAuth: true,
    roles: [
      EAuthRole.Admin,
      EAuthRole.Moderator,
      EAuthRole.SuperAdmin,
      EAuthRole.User,
    ],
  },

  [TERMS_PAGE]: {
    requiresAuth: false,
    roles: [],
  },
};
