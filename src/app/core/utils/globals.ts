import {gResponse, iSnackBarMessage, oResponse} from "../interfaces/oGlobal";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {oContract} from '../interfaces/oContract';
import {oClient} from '../interfaces/oClient';
import {IDCTxnRow} from './UtilDynamiCore';
import {oConektaOrder} from '../interfaces/oConekta';

export const cResponseErrorData: oResponse = {
  data: []
}

export type RoutingParams = {
  contract?: oContract,
  client?: oClient,
  id?: string,
  external_id?: string,
  reference?: string,
  paymentDynamic?: IDCTxnRow,
  orderConekta?: oConektaOrder
}

export enum RouteData {
  CLIENT, CONTRACT, REFERENCE, ID, EXTERNAL_ID, PAYMENT_DYNAMIC, PAYMENT_CONEKTA
}

export const emailContact = "contact@ravcredit.com"

export const cResponseError: gResponse = {
  path: "",
  statusCode: 400,
  epochTime: new Date().getTime(),
  data: cResponseErrorData
}

export enum eEmailType {
  register = "register",
  update = "update"
}

export class GlobalUtils {

  _snackbar = inject(MatSnackBar)

  public static getWidth(): string {
    const mobile = window.innerWidth < 767
    let w = ""
    mobile ? w = "95vw" : "50vw"
    return w
  }

  public async launchSnack(data: iSnackBarMessage) {
    this._snackbar.open(data.message, data.action, data.config)
  }
}
