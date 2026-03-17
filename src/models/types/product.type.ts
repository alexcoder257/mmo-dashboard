import {
  EProductBaseAttributeCode,
  EProductFeaturesAndPorts,
  EProductPowerAndDimensions,
  EProductSpecs,
} from '../enums/product.enum';

export type TProductTechAttributeCode =
  | EProductBaseAttributeCode
  | EProductFeaturesAndPorts
  | EProductPowerAndDimensions
  | EProductSpecs;

export type TViewType = 'grid' | 'list';
