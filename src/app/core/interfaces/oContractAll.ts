import {tyClientContract} from "./oGlobal";
import {IDCAccount} from "../utils/UtilDynamiCore";
import {oClient} from "./oClient";
import {oContract} from "./oContract";

export interface iContractAll {

  getAllLocal(): Promise<void>

  getAllServer(): Promise<void>

  getDynamicTransactionsManual(account: number): Promise<boolean>

  createNewReferenceDynamic(client: tyClientContract): Promise<boolean>

  createNewReferenceConekta(client: tyClientContract): Promise<void>

  createNewReferencePassport(client: tyClientContract): Promise<void>

  referenceCreated(response: boolean, provider: string): void

  getColumnName(column: string): string

  searchDynamicAccount(client: tyClientContract): Promise<IDCAccount | null>

  updateClient(client: Partial<oClient>): Promise<boolean>

  updateContract(id: string, contract: Partial<oContract>): Promise<boolean>

  deleteClient(client: oClient): Promise<boolean>

  deleteContract(contract: oContract): Promise<boolean>

  updateClientAppAccess(client: Partial<oClient>, id: string): Promise<boolean>

  calcTotal(contract: oContract): number
}
