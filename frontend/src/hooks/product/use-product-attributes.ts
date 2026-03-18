// TODO: implement — stub for build compatibility
import { ICustomAttribute } from '@/models/interfaces/product.interface';

export const useProductAttributes = (customAttributes: ICustomAttribute[]) => {
  const getProductAttribute = (attributeCode: string): ICustomAttribute | undefined => {
    return customAttributes.find((attr) => attr.attributeCode === attributeCode);
  };

  const getProductAttributeValue = (attributeCode: string): string | string[] | undefined => {
    return getProductAttribute(attributeCode)?.value;
  };

  return {
    customAttributes,
    getProductAttribute,
    getProductAttributeValue,
  };
};
