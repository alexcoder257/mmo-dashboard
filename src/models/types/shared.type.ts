import { Dayjs } from 'dayjs';

import { ERROR_CODES, MODAL_KEYS, SELECTORS } from '@/constants/shared.const';

import { EHttpStatusCode, EResponseStatus } from '../enums/shared.enum';

export type ModalKey = (typeof MODAL_KEYS)[keyof typeof MODAL_KEYS];
export type TDate = Date | Dayjs | number | string;
export type TErrorCodes = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type TFailureResponse<D = unknown> = {
  error: D;
  status: EResponseStatus;
  statusCode: EHttpStatusCode;
};

export type TKeyLabel<L = string> = {
  key: string;
  label: L;
};

export type TLoadingTargets =
  | 'fullscreen'
  | (typeof SELECTORS)[keyof typeof SELECTORS];

export type TObjectBoolean = Record<string, boolean>;
export type TObjectString = Record<string, string>;
export type TObjectUnknown = Record<string, unknown>;

export type TOptions<V = boolean | number | string | TObjectUnknown> = {
  key?: number | string;
  label: string;
  value: V;
};

export type TSuccessResponse<D = unknown, M = unknown> = {
  data: D;
  meta: M;
  status: EResponseStatus;
  statusCode: EHttpStatusCode;
};
