import { PRODUCT_API } from '@/constants/route-apis.const';
import { get } from '@/libs/fetch/utils';
import {
  IProduct,
  IProductAttribute,
  IProductDocument,
  IProductResponse,
} from '@/models/interfaces/product.interface';
import { TObjectUnknown } from '@/models/types/shared.type';
import { cleanQueryString, formatQueryString } from '@/utils/shared.util';

export const productListApi = async (queryParams: TObjectUnknown) => {
  const url = formatQueryString(
    PRODUCT_API.LIST,
    cleanQueryString(queryParams),
  );
  return await get<IProductResponse>(url);
};

export const productDetailApi = async (sku: string) => {
  const url = `${PRODUCT_API.LIST}/${sku}`;
  return await get<IProduct>(url);
};

export const productAttributeOptionsApi = async (attributeCode: string) => {
  const url = `${PRODUCT_API.ATTRIBUTES}/${attributeCode}`;
  return await get<IProductAttribute>(url);
};

export const productDocumentsApi = async (productIds: string) => {
  const url = formatQueryString(
    PRODUCT_API.DOCUMENTS,
    cleanQueryString({ productIds }),
  );
  return await get<IProductDocument[]>(url);
};
