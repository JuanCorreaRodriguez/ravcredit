import {oContract} from "./oContract";

export enum ePassportTypes {
  CREATE = "create_references",
  SEND = "send_references"
}

/** *********************************************************************************/
export interface iPassportAdditional {
  client?: string;
  clientID?: string;
  credit?: string;
}

export interface iPassportReferenceData {
  name: string;
  email: string;
  amount: number;
  expirationDate: string;
  additional: iPassportAdditional;
}

/** Passport request interface base */
export interface iPassportReference {
  type: string;
  data: iPassportReferenceData;
}

/** Global passport reference aPI */
export interface iGlobalPassport {
  passport: iPassportReference;
  contract: oContract
  date?: number
}

/** ******************************** */
export interface iPassportResponseData {
  name: string;
  email: string;
  amount: number;
  expirationDate: string;
  additional: iPassportAdditional;
}

export interface iPassportReferenceCenters {
  name: string;
  logo: string;
}

export interface iPassportReferenceRes {
  reference: string
  centers: iPassportReferenceCenters[],
  centerId: number,
  barcode: string
}

/** Passport response interface base */
export interface iPassportResponse {
  type: string;
  data: iPassportResponseData;
  message: string;
  references: iPassportReference[];
}

/** ******************************** */
