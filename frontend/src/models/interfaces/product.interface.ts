import { PcSpecs } from '../enums/product.enum';
import { TProductTechAttributeCode } from '../types/product.type';
import { TOptions } from '../types/shared.type';

export interface ICardProduct {
  attributeSetId: number;
  customAttributes?: ICustomAttribute[];
  id: number;
  img: string;
  name: string;
  properties: {
    [key in PcSpecs]?: string;
  };
  sku: string;
}

export interface ICustomAttribute {
  attributeCode: TProductTechAttributeCode;
  label?: string;
  value: string | string[];
}

export interface ICustomAttributePcSpecs {
  attributeCode: PcSpecs;
  value: string | string[];
}

export interface IFilterGroup {
  filters: Array<{
    conditionType: string;
    field: string;
    value: string;
  }>;
}

export interface IMediaGalleryEntry {
  file: string;
  id: number;
  label: string;
}

export interface IProduct {
  attributeSetId: number;
  customAttributes: ICustomAttribute[];
  id: number;
  mediaGalleryEntries: IMediaGalleryEntry[];
  name: string;
  productLinks: IProductLink[];
  sku: string;
}

export interface IProductAttribute {
  attributeCode: string;
  options: TOptions[];
}

export interface IProductDocument {
  createdAt: string;
  fileId: number;
  fileName: string;
  fileSize: number;
  iconAlt: string;
  iconUrl: string;
  label: string;
  mimeType: string;
  url: string;
}
export interface IProductFilter {
  categoryId?: (number | string)[];
  options?: Record<string, null | number | string>[];
}

export interface IProductLink {
  linkedProductSku: string;
  linkedProductType: string;
  linkType: string;
  position: number;
  sku: string;
}

export interface IProductQueryParams {
  currentPage?: number;
  filter?: IProductFilter;
  pageSize?: number;
}

export interface IProductResponse {
  items: IProduct[];
  searchCriteria: {
    currentPage: number;
    filterGroups: IFilterGroup[];
    pageSize: number;
  };
  totalCount: number;
}

export interface ISearchQueryParams {
  currentPage?: number;
  pageSize?: number;
  searchCriteria?: {
    filterGroups?: IFilterGroup[];
    requestName?: string;
    sortOrders?: Array<{
      direction: 'ASC' | 'DESC';
      field: string;
    }>;
  };
}

export interface ISearchResponse {
  items: IProduct[];
  searchCriteria: {
    currentPage: number;
    filterGroups: IFilterGroup[];
    pageSize: number;
    requestName?: string;
    sortOrders?: Array<{
      direction: 'ASC' | 'DESC';
      field: string;
    }>;
  };
  totalCount: number;
}
