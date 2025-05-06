import {IDCAccount, IDCClient} from "../utils/UtilDynamiCore";
import {oClient} from "./oClient";
import {oContract} from "./oContract";
import {eProvider} from "../utils/UtilContract";

export interface ISearchClient {
  selectClient(): void

  verifyClientRavCredit(client: string): Promise<void>

  verifyClientConekta(client: string): Promise<void>

  verifyClientDynamic(client: string): Promise<void>

  verifyAccountDynamic(client: IDCClient): Promise<void>

  getContract(data: oClient): Promise<void>

  ravCreditSetData(data: oClient, contract: oContract): Promise<void>

  dynamicSetDataCustomer(data: IDCClient): Promise<void>

  dynamicSetDataAccount(account: IDCAccount): Promise<void>

  conektaSetData(data: any): Promise<void>

  setProvider(value: eProvider): void

  setAvailableCurp(value: string): void
}
