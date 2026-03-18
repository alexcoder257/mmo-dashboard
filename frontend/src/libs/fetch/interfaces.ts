/* eslint-disable @typescript-eslint/no-explicit-any */
import { EHttpStatusCode } from '@/models/enums/shared.enum';

export interface IFetchFailureResponse {
  error: any;
  status: EHttpStatusCode;
}

export interface IFetchSuccessResponse {
  data: any;
  status: EHttpStatusCode;
}
