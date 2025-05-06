import {oAddress} from "./oAddress";
import {oDevice} from "./oDevice";
import {oFinancial} from "./oFinancial";

export interface iContract {
  createContract(data: any, monthlyPay: number, finalPayment: number): Promise<void>

  editContract(): void

  verifyClient(clientCurp: string): Promise<void>

  dataClient(client: string): void

  referenceAdded(reference: number): Promise<void>
}

export interface oContract {
  id: string
  dynamicAccount?: number
  client: string
  address: oAddress
  device: oDevice
  financial: oFinancial
  createdAt?: number
  lastPayment?: number
  by: string,
  active: boolean,
  photo?: string,
}

