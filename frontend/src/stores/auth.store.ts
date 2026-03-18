import jsCookie from 'js-cookie';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { authProfileApi, authRefreshTokenApi } from '@/apis/auth.api';
import { COOKIE_KEYS } from '@/constants/shared.const';
import { EAuthRole } from '@/models/enums/auth.enum';
import {
  IAuthUserInfo,
  IRegistrationInfo,
} from '@/models/interfaces/auth.interface';

interface IState {
  accessToken: null | string;
  initialize: () => Promise<void>;
  isAuthenticated: boolean;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  registrationInfo?: IRegistrationInfo;
  setRegistrationInfo: (info: IRegistrationInfo) => void;
  setToken: (token: string) => void;
  setUser: (data: IAuthUserInfo) => void;
  userInfo?: IAuthUserInfo;
}

export const useAuthStore = create<IState>()(
  devtools((set, get) => ({
    accessToken: jsCookie.get(COOKIE_KEYS.ACCESS_TOKEN),

    initialize: async () => {
      const isLoggedIn = Boolean(get().accessToken);
      if (!isLoggedIn) {
        set({ isAuthenticated: false });
        return;
      }

      try {
        const { data } = await authProfileApi();
        if (data) {
          get().setUser({
            ...data,
            role: EAuthRole.User,
          });
        } else {
          set({ isAuthenticated: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        get().logout();
      }
    },

    isAuthenticated: Boolean(jsCookie.get(COOKIE_KEYS.ACCESS_TOKEN)),

    logout: () => {
      set({
        accessToken: null,
        isAuthenticated: false,
        registrationInfo: undefined,
        userInfo: undefined,
      });
      jsCookie.remove(COOKIE_KEYS.ACCESS_TOKEN);
      jsCookie.remove(COOKIE_KEYS.CHAT_TOKEN);
    },

    refreshToken: async (): Promise<boolean> => {
      let result = true;
      try {
        const response = await authRefreshTokenApi();
        get().setToken(response.data);
      } catch (error) {
        result = false;
        console.error(error);
        get().logout();
      }
      return result;
    },

    registrationInfo: undefined,

    setRegistrationInfo: (info: IRegistrationInfo) =>
      set({ registrationInfo: info }),

    setToken: (token: string) => {
      jsCookie.set(COOKIE_KEYS.ACCESS_TOKEN, token, {
        expires: 1,
        path: '/',
        sameSite: 'lax',
      });
      set({ accessToken: token, isAuthenticated: true });
    },

    setUser: (data: IAuthUserInfo) =>
      set({ isAuthenticated: true, userInfo: data }),
    userInfo: undefined,
  })),
);
