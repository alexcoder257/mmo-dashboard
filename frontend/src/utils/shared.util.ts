import { message, notification } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import jsCookie from 'js-cookie';
import { stringify } from 'qs';
import { create, StateCreator } from 'zustand';

import { COOKIE_KEYS } from '@/constants/shared.const';
import {
  ELanguageCode,
  EMessage,
  EResponseStatus,
  EToast,
} from '@/models/enums/shared.enum';
import {
  TDate,
  TFailureResponse,
  TObjectUnknown,
} from '@/models/types/shared.type';
import { useAuthStore } from '@/stores/auth.store';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const cleanQueryString = <T>(queryParams: TObjectUnknown): T => {
  const result = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== undefined && value !== '',
    ),
  );
  return result as T;
};

export const convertToCamelCase = <T>(
  data: TObjectUnknown | TObjectUnknown[],
): T => {
  if (Array.isArray(data))
    return data.map((item) => convertToCamelCase(item)) as T;
  if (data === null || typeof data !== 'object') return data as T;

  const result: TObjectUnknown = {};
  Object.keys(data).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    const value = data[key];

    if (typeof value === 'object' && value !== null) {
      if (
        (value as TObjectUnknown).constructor === Object ||
        Array.isArray(value)
      ) {
        result[newKey] = convertToCamelCase(value as TObjectUnknown);
        return;
      }
    }
    result[newKey] = value;
  });
  return result as T;
};

export const convertToSnakeCase = <T>(
  data: TObjectUnknown | TObjectUnknown[],
): T => {
  if (Array.isArray(data))
    return data.map((item) => convertToSnakeCase(item)) as T;
  if (!data || typeof data !== 'object') return data as T;

  const result: TObjectUnknown = {};
  Object.keys(data).forEach((key) => {
    const newKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
    const value = data[key];

    if (typeof value === 'object' && value !== null) {
      result[newKey] = convertToSnakeCase(value as TObjectUnknown);
      return;
    }
    result[newKey] = value;
  });
  return result as T;
};

export const formatDateUTC = (date: TDate) => {
  return dayjs(date).utc().toISOString();
};

export const formatDate = (
  date: TDate,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) => {
  return dayjs(date).format(format);
};

export const getTimeAgo = (date: TDate) => {
  return dayjs(date).fromNow();
};

export const formatQueryString = (
  baseUrl: string,
  queryParams: string | string[] | TObjectUnknown,
): string => {
  if (
    !queryParams ||
    (Array.isArray(queryParams) && queryParams.length === 0) ||
    (typeof queryParams === 'object' && Object.keys(queryParams).length === 0)
  )
    return baseUrl;

  const queryString =
    typeof queryParams === 'string'
      ? queryParams
      : stringify(queryParams, { arrayFormat: 'brackets' });

  return `${baseUrl}?${queryString}`;
};

export const isFailureResponse = (
  response: Error | TFailureResponse,
): response is TFailureResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    response.status === EResponseStatus.Failure
  );
};

export const showToast = (
  description: string,
  type: EToast = EToast.Success,
  message: string = type,
) => {
  notification[type]({
    description,
    duration: 3,
    message,
  });
};

export const showMessage = (
  content: string,
  type: EMessage = EMessage.Info,
): void => {
  message.open({
    content,
    duration: 3,
    type,
  });
};

export const sleep = async (second: number) => {
  return await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, 1000 * second);
  });
};

export const resetAll = <T>(stateCreator?: StateCreator<T>) => {
  const storeResetFns = new Set<() => void>();

  if (stateCreator) {
    const store = create(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });
  }

  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const getPathnameWithoutLocale = (pathname: string) => {
  const locales = Object.values(ELanguageCode);
  const pathParts = pathname.split('/');

  if (pathParts.length > 1 && locales.includes(pathParts[1] as ELanguageCode))
    return '/' + pathParts.slice(2).join('/');

  return pathname;
};

export const getAccessToken = (): null | string | undefined => {
  if (typeof window !== 'undefined')
    return jsCookie.get(COOKIE_KEYS.ACCESS_TOKEN);

  return useAuthStore.getState().accessToken;
};

export const processContent = (content: string) => {
  const skuMatches = content.match(/SKU:\s*([A-Z0-9]+)/g);
  const skuMap = new Map<string, string>();

  if (skuMatches) {
    skuMatches.forEach((match, index) => {
      const sku = match.replace('SKU: ', '');
      skuMap.set(`sku_${index}`, sku);
    });
  }

  let processedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
    .replace(/^# (.*$)/gm, '<h3 class="text-xl font-bold mb-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h4 class="text-lg font-semibold mb-2">$1</h4>')
    .replace(/^### (.*$)/gm, '<h5 class="text-base font-semibold mb-2">$1</h5>')
    .replace(/^#### (.*$)/gm, '<h6 class="text-sm font-semibold mb-1">$1</h6>')
    .replace(/^---$/gm, '<hr class="my-4 border-gray-300">')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)(\s*<li>.*<\/li>)*/g, (match) => {
      const items = match.match(/<li>.*<\/li>/g);
      if (items && items.length > 0) {
        return `<ul class="list-disc pl-6 space-y-1">${items.join('')}</ul>`;
      }
      return match;
    });

  const productDetailPatterns = [
    { pattern: /\[Chi tiết sản phẩm\]\(#\)/g, text: 'Chi tiết sản phẩm' }, // Vietnamese
    { pattern: /\[Xem chi tiết\]\(#\)/g, text: 'Xem chi tiết' }, // Vietnamese
    { pattern: /\[Product Details\]\(#\)/g, text: 'Product Details' }, // English
    { pattern: /\[View Details\]\(#\)/g, text: 'View Details' }, // English
    { pattern: /\[製品詳細\]\(#\)/g, text: '製品詳細' }, // Japanese
    { pattern: /\[詳細を見る\]\(#\)/g, text: '詳細を見る' }, // Japanese
  ];

  let linkIndex = 0;

  productDetailPatterns.forEach(({ pattern, text }) => {
    processedContent = processedContent.replace(pattern, () => {
      const sku = skuMap.get(`sku_${linkIndex}`) || '';
      linkIndex++;
      return `<a href="/product/${sku}" class="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
  });

  processedContent = processedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  return processedContent;
};
