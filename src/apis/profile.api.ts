import type {
  IAuthChangePassword,
  IAuthUserInfo,
  ICustomerUpdate,
} from '@/models/interfaces/auth.interface';

import { PROFILE_API } from '@/constants/route-apis.const';
import { get, put } from '@/libs/fetch/utils';

export const getProfileApi = async () => {
  const url = PROFILE_API.USER_INFO;
  return await get<IAuthUserInfo>(url);
};

export const changeUserNameApi = async (data: ICustomerUpdate) => {
  const url = PROFILE_API.CHANGE_USER_NAME;
  return await put<unknown>(url, data, undefined, undefined);
};

export const changePasswordApi = async (data: IAuthChangePassword) => {
  const url = PROFILE_API.CHANGE_PASSWORD;
  return await put<unknown>(url, data, undefined, undefined);
};
