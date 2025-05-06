import {oConektaRes} from "../interfaces/oConekta";
import {IDCTxnRow} from "./UtilDynamiCore";
import {eProvider} from "./UtilContract";

export interface oPaymentGlobal {
  conektaPayment?: oConektaRes,
  dynamicPayment?: IDCTxnRow[],
}

export class FactoryPayment {
  public static CreatePayment(data: oConektaRes | IDCTxnRow[], provider: eProvider): oPaymentGlobal {
    const o: oPaymentGlobal = {}

    if (provider == eProvider.DynamiCore)
      o.dynamicPayment = data as IDCTxnRow[];

    if (provider == eProvider.Conekta)
      o.conektaPayment = data as oConektaRes

    return o
  }
}
