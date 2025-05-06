import {oClient} from "../interfaces/oClient";
import {ePassportTypes, iGlobalPassport} from "../interfaces/oPassport";
import {oContract} from "../interfaces/oContract";

export class FactoryPassport {
  public static CreatePassportReference(
    client: oClient,
    contract: oContract,
    dateTime?: number
  ): iGlobalPassport {
    const o = {
      passport: {
        type: ePassportTypes.CREATE,
        data: {
          name: client.name,
          email: client.email,
          amount: contract.financial.weeklyPayment,
          expirationDate: "",
          additional: {
            client: client.name,
            clientID: client.id,
            credit: client.status
          }
        }
      },
      contract: contract,
      date: dateTime
    }
    if (dateTime != undefined) o.date = dateTime
    return o
  }
}
