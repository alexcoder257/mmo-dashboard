import type {
  IAuthLoginRequest,
  IAuthRegister,
  IAuthUserInfo,
} from '@/models/interfaces/auth.interface';

import { AUTH_API } from '@/constants/route-apis.const';
import { get, post } from '@/libs/fetch/utils';

export const authLoginApi = async (data: IAuthLoginRequest) => {
  const url = AUTH_API.LOGIN;
  return await post<string>(url, data, { credentials: 'include' });
};

export const authProfileApi = async () => {
  const url = AUTH_API.PROFILE;
  return await get<IAuthUserInfo>(url);
};

export const authRefreshTokenApi = async () => {
  const url = AUTH_API.REFRESH_TOKEN;
  return await post<string>(url, undefined, {
    credentials: 'include',
  });
};

export const authRegisterApi = async (data: IAuthRegister) => {
  const url = AUTH_API.REGISTER;
  return await post<unknown>(
    url,
    data,
    undefined,
    undefined,
    'Registration successful',
  );
};
