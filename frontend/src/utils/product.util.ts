// TODO: implement — stub for build compatibility
import { EProductBaseAttributeCode } from '@/models/enums/product.enum';
import {
  ICardProduct,
  ICustomAttribute,
  IProduct,
  IProductDocument,
} from '@/models/interfaces/product.interface';
import { CompareProduct } from '@/stores/compare.store';

export const getProductImage = (
  productOrPath: IProduct | string,
  baseUrl: string = '',
): string => {
  if (typeof productOrPath === 'string') {
    return productOrPath ? `${baseUrl}${productOrPath}` : '';
  }
  const imageAttr = productOrPath.customAttributes?.find(
    (attr) => attr.attributeCode === EProductBaseAttributeCode.Image,
  );
  const imagePath = imageAttr?.value;
  if (typeof imagePath === 'string' && imagePath) {
    return `${baseUrl}${imagePath}`;
  }
  return '';
};

export const mapProductToCardProduct = (
  product: IProduct,
  baseUrl: string = '',
): ICardProduct => {
  return {
    attributeSetId: product.attributeSetId,
    customAttributes: product.customAttributes,
    id: product.id,
    img: getProductImage(product, baseUrl),
    name: product.name,
    properties: {},
    sku: product.sku,
  };
};

export const generateCompareSections = (
  _attributeSets: unknown | { attributeSetId: number; attributeSetName: string }[],
  _products: CompareProduct[] | IProduct[],
  _attributeSetId?: number,
): { attributes: { label: string; values: string[] }[]; section: string; title: string }[] => {
  // TODO: implement — stub returns empty sections
  return [];
};

export const extractSpecificationsFromAttributes = (
  customAttributes: ICustomAttribute[],
): { code: string; label: string; value: string }[] => {
  return customAttributes
    .filter((attr) => typeof attr.value === 'string' && attr.value)
    .map((attr) => ({
      code: attr.attributeCode,
      label: attr.label || attr.attributeCode,
      value: attr.value as string,
    }));
};

export const getProductDocuments = (
  documents: IProductDocument[],
): IProductDocument[] => {
  return documents ?? [];
};

export const mapProductValue = (
  customAttributes: ICustomAttribute[],
  attributeCode: string,
): string => {
  const attr = customAttributes?.find((a) => a.attributeCode === attributeCode);
  if (!attr) return '';
  if (Array.isArray(attr.value)) return attr.value.join(', ');
  return attr.value;
};
