import {oUser} from "./oUser";
import {oBusinessInfo, oSchedule} from "./oBusiness";
import {oClient} from "./oClient";
import {oDevice} from "./oDevice";
import {oAddress} from "./oAddress";
import {oFinancial} from "./oFinancial";
import {MatSnackBarConfig} from "@angular/material/snack-bar";
import {oContract} from "./oContract";
import {oNotification} from "./oNotification";
import {cClient} from "../utils/UtilClient";
import {cContract} from "../utils/UtilContract";

export enum eRoles { Administrator = "Administrator", Seller = "Seller", Consultant = "Consultant" }

export enum eLoginStatus {
  IDLE = "IDLE",
  ERROR = "ERROR",
  AUTHORIZED = "AUTHORIZED",
  CHECKING = "CHECKING",
  NOAUTHORIZED = "NOAUTHORIZED",
  ERRORPASSWORD = "ERRORPASSWORD"
}

export enum eClientStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PAUSED = "paused",
  CANCELED = "canceled",
  LATE = "late"
}

export const cSingleOptionClientStatus: iOptionsSelect = {
  viewValue: "",
  value: ""
}
export const cOptionsClientStatus: iOptionsSelect[] = [
  {
    value: eClientStatus.ACTIVE,
    viewValue: "Activar"
  }, {
    value: eClientStatus.COMPLETED,
    viewValue: "Completar"
  }, {
    value: eClientStatus.PAUSED,
    viewValue: "Pausar"
  }, {
    value: eClientStatus.LATE,
    viewValue: "Marcar con atraso"
  }, {
    value: eClientStatus.CANCELED,
    viewValue: "Cancelar"
  }
]

export interface iOptionsSelect {
  viewValue: String
  value: String
}

export interface iSelect {
  viewValue: eRoles
  value: eRoles
}

export const eRolesSelect: iSelect[] = [
  {
    value: eRoles.Administrator,
    viewValue: eRoles.Administrator
  },
  {
    value: eRoles.Consultant,
    viewValue: eRoles.Consultant
  },
  {
    value: eRoles.Seller,
    viewValue: eRoles.Seller
  },
]

export interface iConfigUUID {
  client_uuid?: string;
  contract_uuid: string;
}

export interface iPaymentDelay {
  today: number;
  nextPayment: number;
  daysDelay: number
  late: boolean
}

export const cPaymentDalay: iPaymentDelay = {
  today: 0,
  nextPayment: 0,
  daysDelay: 0,
  late: false,
}

//Used for communicate response through services
export interface oResponse {
  error?: string;
  data: oUser | oUser[] | oBusinessInfo | oAddress |
    oSchedule | oFinancial | string | iPaymentDelay |
    oClient | oDevice | iConfigUUID | Response | oNotification;
}

//Used for global interceptor to handle standard response
export interface gResponse {
  status?: boolean; // indicates whether resource required was returned
  path: string;
  statusCode: number;
  error?: string;
  epochTime: number;
  data: any; // att with resources required [Optional]
}

export interface gResponseFuncEmail {
  success: boolean,
  message: any
}

export const snackBarConfigAction: MatSnackBarConfig = {
  horizontalPosition: "start"
}
export const snackBarConfigNoAction: MatSnackBarConfig = {
  duration: 4000,
  horizontalPosition: "start"
}

export interface iInformativeDialog {
  message: string,
  title: string,
  cancel: string,
  continue: string
}

export interface iSnackBarMessage {
  message: string,
  action: string,
  config: MatSnackBarConfig
}

//
// export interface iClientContract extends oClient, oContract {
// }

export type tyClientContract = oClient & oContract

export const cTyClientContract = {...cClient, ...cContract}

export interface oContractMetrics {
  total: number
  activated: number
  paused: number
  completed: number
  canceled: number
  late: number
  dynamicCount: number
  passportCount: number
  conektaCount: number
  rateTotal: number
  rateActive: number
  ratePaused: number
  rateComplete: number
  rateCanceled: number
  rateLate: number
}

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export interface oPaymentDates {
  week: number
  date: number
}
