import { PRODUCT_API } from '@/constants/route-apis.const';
import { get } from '@/libs/fetch/utils';
import { ISearchResponse } from '@/models/interfaces/product.interface';
import { TObjectUnknown } from '@/models/types/shared.type';
import { cleanQueryString, formatQueryString } from '@/utils/shared.util';

export const searchProductsApi = async (queryParams: TObjectUnknown) => {
  const url = formatQueryString(
    PRODUCT_API.LIST,
    cleanQueryString(queryParams),
  );
  return await get<ISearchResponse>(url);
};
