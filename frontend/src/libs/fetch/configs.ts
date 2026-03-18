// import { handleUnauthorizedError } from '@/libs/fetch/util';
import {
  convertToCamelCase,
  convertToSnakeCase,
  getAccessToken,
} from '@/utils/shared.util';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const fetchInstance = async (
  url: RequestInfo | URL,
  config?: RequestInit,
) => {
  try {
    const request = await requestInterceptor(url, config);
    const response = await fetch(request);
    return responseInterceptor(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

async function requestInterceptor(
  url: RequestInfo | URL,
  config?: RequestInit,
) {
  const accessToken = getAccessToken();
  const headers = new Headers(defaultHeaders);
  const requestConfig = config || {};
  const requestUrl =
    typeof url === 'string' && url.startsWith('http')
      ? url
      : baseURL + (url as string);

  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  if (requestConfig.headers) {
    const configHeaders = new Headers(requestConfig.headers);
    configHeaders.forEach((value, key) => headers.set(key, value));
  }

  if (requestConfig.body && typeof requestConfig.body === 'string') {
    requestConfig.body = JSON.stringify(
      convertToSnakeCase(JSON.parse(requestConfig.body)),
    );
  }

  return new Request(requestUrl, { ...requestConfig, headers });
}

async function responseInterceptor(response: Response) {
  const responseJson = await response.json();

  if (!response.ok) {
    // if (response.status === EHttpStatusCode.Unauthorized)
    //   handleUnauthorizedError({ data, response });

    const newResponse = {
      ...responseJson,
      status: response.status,
    };
    return Promise.reject(newResponse);
  }

  const newResponse = {
    ...responseJson,
    data: convertToCamelCase(responseJson),
    status: response.status,
  };
  return newResponse;
}
