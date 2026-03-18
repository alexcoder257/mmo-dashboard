import type {
  TFailureResponse,
  TLoadingTargets,
  TSuccessResponse,
} from '@/models/types/shared.type';

import { fetchInstance } from '@/libs/fetch/configs';
import { EResponseStatus } from '@/models/enums/shared.enum';
import { useLoadingStore } from '@/stores/loading.store';
import { showToast } from '@/utils/shared.util';

import { IFetchFailureResponse, IFetchSuccessResponse } from './interfaces';

interface IFetchRequestConfig extends Omit<RequestInit, 'headers'> {
  _retry?: boolean;
  headers?: HeadersInit;
  params?: Record<string, unknown>;
  url?: string;
}

type TMethods = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

const request = async <D = unknown, M = unknown>(
  method: TMethods,
  url: string,
  data: unknown,
  config?: IFetchRequestConfig,
  loadingTarget?: TLoadingTargets,
  toastMessage?: string,
) => {
  try {
    if (loadingTarget) useLoadingStore.getState().showLoading();

    const fetchConfig: RequestInit = {
      headers: config?.headers || {},
      method,
    };

    if (data) fetchConfig.body = JSON.stringify(data);
    if (config) Object.assign(fetchConfig, config);

    const response: IFetchSuccessResponse = await fetchInstance(
      url,
      fetchConfig,
    );

    if (toastMessage) showToast(toastMessage);

    const result: TSuccessResponse<D, M> = {
      data: response.data as D,
      meta: response.data.meta,
      status: EResponseStatus.Success,
      statusCode: response.status,
    };
    return result;
  } catch (error) {
    const failureResponse = error as IFetchFailureResponse;
    // let errorCode = ERROR_CODES.ERR_500;
    // let errorData = null;
    // let errorMessage = 'An error occurred';
    // let statusCode = 500;
    let errorResponse = null;
    let statusCode = 500;

    if (failureResponse) {
      // errorCode = failureResponse.error.code || errorCode;
      // errorData = failureResponse.error.data || errorData;
      // errorMessage = failureResponse.error.message || errorMessage;
      // statusCode = failureResponse.status || statusCode;
      errorResponse = failureResponse.error;
      statusCode = failureResponse.status || statusCode;
    }

    const result: TFailureResponse = {
      error: errorResponse,
      status: EResponseStatus.Failure,
      statusCode,
    };
    return Promise.reject(result);
  } finally {
    if (loadingTarget) useLoadingStore.getState().hideLoading();
  }
};

export const del = async <D = unknown, M = unknown>(
  url: string,
  config?: IFetchRequestConfig,
  loadingTarget?: TLoadingTargets,
  toastMessage?: string,
) => {
  return await request<D, M>(
    'DELETE',
    url,
    undefined,
    config,
    loadingTarget,
    toastMessage,
  );
};

export const get = async <D = unknown, M = unknown>(
  url: string,
  config?: IFetchRequestConfig,
  loadingTarget?: TLoadingTargets,
  toastMessage?: string,
) => {
  return await request<D, M>(
    'GET',
    url,
    undefined,
    config,
    loadingTarget,
    toastMessage,
  );
};

// export const handleUnauthorizedError = async (
//   error: AxiosError<TFailureResponse>,
// ) => {
//   const isTokenRefreshed = await useAuthStore.getState().refreshToken();
//   const accessToken = jsCookie.get(COOKIE_KEYS.ACCESS_TOKEN);
//   const originalRequest = error.config as IAxiosRequestConfig;

//   if (!isTokenRefreshed) {
//     useAuthStore.getState().logout();
//     window.location.href = AUTH_PAGE.LOGIN;
//     return;
//   }

//   if (originalRequest) {
//     if (!originalRequest.headers) originalRequest.headers = {};
//     originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//     if (!originalRequest._retry) {
//       originalRequest._retry = true;
//       await axiosInstance(originalRequest);
//     }
//   }
// };

export const patch = async <D = unknown, M = unknown>(
  url: string,
  data: unknown,
  config?: IFetchRequestConfig,
  loadingTarget?: TLoadingTargets,
  toastMessage?: string,
) => {
  return await request<D, M>(
    'PATCH',
    url,
    data,
    config,
    loadingTarget,
    toastMessage,
  );
};

export const post = async <D = unknown, M = unknown>(
  url: string,
  data: unknown,
  config?: IFetchRequestConfig,
  loadingTarget?: TLoadingTargets,
  toastMessage?: string,
) => {
  return await request<D, M>(
    'POST',
    url,
    data,
    config,
    loadingTarget,
    toastMessage,
  );
};

export const put = async <D = unknown, M = unknown>(
  url: string,
  data: unknown,
  config?: IFetchRequestConfig,
  loadingTarget?: TLoadingTargets,
  toastMessage?: string,
) => {
  return await request<D, M>(
    'PUT',
    url,
    data,
    config,
    loadingTarget,
    toastMessage,
  );
};
