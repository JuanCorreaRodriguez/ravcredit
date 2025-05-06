import {oContract} from "./oContract";
import {oClient} from "./oClient";

export interface iNewPayment {
  getContract(): Promise<void>;

  getContractApi(): Promise<oContract>;

  getClient(contract: oContract): Promise<void>;

  getClientApi(contract: oContract): Promise<oClient>;

  getParams(): Promise<void>

  getAccount(): Promise<boolean>

  createPayment(): Promise<string>;
}
