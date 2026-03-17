import type { EAuthRole } from '../enums/auth.enum';
import type { TAuthActions, TAuthSubjects } from '../types/auth.type';

export interface IAddress {
  city: string;
  company: string;
  countryId: string;
  customerId: number;
  firstName: string;
  id: number;
  lastName: string;
  postCode: string;
  region: IRegion;
  regionId: number;
  street: string[];
  telephone: string;
}

export interface IAuthChangePassword {
  currentPassword: string;
  newPassword: string;
}

// export interface IAuthLoginResponse {
//   accessToken: string;
// }

export interface IAuthLoginRequest {
  password: string;
  username: string;
}

export interface IAuthPermission {
  action: TAuthActions;
  subject: TAuthSubjects;
}

export interface IAuthRegister {
  customer: {
    custom_attributes?: {
      attribute_code: string;
      value: string;
    }[];
    email: string;
    firstname: string;
    lastname?: string;
  };
  password: string;
}

export interface IAuthUserInfo {
  addresses: IAddress[];
  createdAt: string;
  createdIn: string;
  disableAutoGroupChange: number;
  email: string;
  extensionAttributes: IExtensionAttributes;
  firstname: string;
  gender: number;
  groupId: number;
  id: number;
  lastname: string;
  role: EAuthRole;
  storeId: number;
  updatedAt: string;
  websiteId: number;
}

export interface ICustomerUpdate {
  customer: {
    email: string;
    firstname: string;
    lastname?: string;
  };
}

export interface IExtensionAttributes {
  groupName: string;
  isSubscribed: boolean;
}

export interface IRegion {
  region: string;
  regionCode: string;
  regionId: number;
}

export interface IRegistrationInfo {
  email: string;
  firstname: string;
  password: string;
}
