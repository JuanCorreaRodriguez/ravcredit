import {EnvironmentInjector, inject, Injectable, signal} from '@angular/core';
import {IDCAccount, IDCGeneratedReference, IDCTxnRow} from '../utils/UtilDynamiCore';
import {oClient} from '../interfaces/oClient';
import {oContract} from '../interfaces/oContract';
import {DynamicRepository} from '../data/Network/Dynamic';
import {UtilTime} from '../utils/UtilTime';
import {eProvider} from '../utils/UtilContract';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {lastPayment} from '../utils/config';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {
  status = signal<string>("")
  paymentCount = signal<number>(0)
  injector = inject(EnvironmentInjector)

  constructor(
    private readonly dynamicRepository: DynamicRepository,
    private readonly iDb: IndexedDbService
  ) {
  }

  getDynamicAccount = async (
    id: string,
    _path?: string
  ): Promise<IDCAccount | null> => {
    let account = await this.dynamicRepository.getDynamicAccount(id)
    if (account == undefined) account = await this.dynamicRepository.getDynamicAccountApi(id, _path);
    return account
  }

  getDynamicAccountApi =
    async (id: string, _path?: string): Promise<IDCAccount | null> =>
      await this.dynamicRepository.getDynamicAccountApi(id, _path)

  async initDynamicCreateReference(
    client: oClient,
    contract: oContract
  ): Promise<oClient | null> {

    if (client.references != null && client.references.length > 0) {
      let last = client.references.length - 1
      if (client.references[last].date) {
        // return this.dynamicRepository.initDynamicCreateReference(client, contract, client.references[last].date)
        return await this.dynamicRepository.createCustomerDynamicRef(client, contract, client.references[last].date)
      }
    }
    return await this.dynamicRepository.createCustomerDynamicRef(client, contract)
    // return this.dynamicRepository.initDynamicCreateReference(client, contract)
  }

  getReference = async (
    reference: string
  ): Promise<IDCGeneratedReference | null> => {
    let ref = await this.dynamicRepository.getReference(reference)
    if (!ref) ref = await this.dynamicRepository.getReferenceApi(reference)
    return ref
  }

  getReferenceApi =
    async (reference: string): Promise<IDCGeneratedReference | null> =>
      await this.dynamicRepository.getReferenceApi(reference)

  async getPayment(id: string, external_id?: string): Promise<IDCTxnRow> {
    let payment = await this.dynamicRepository.getPayment(id)
    if (payment == undefined && external_id != undefined) {
      let _payment = await this.dynamicRepository.getPaymentApi(external_id)
      if (_payment) payment = _payment
    }
    return payment
  }

  /* Not exists local records for this: just call api to get transactions */
  getPayments = async (
    account: number
  ): Promise<IDCTxnRow[]> => {
    let pays = await this.dynamicRepository.getPayments(account)
    if (pays.length == 0) pays = await this.dynamicRepository.getPaymentsApi(account)
    this.paymentCount.set(pays.length)
    this.LastTransactionTime(pays)
    return pays
  }

  getPaymentsApi = async (
    account: number
  ): Promise<IDCTxnRow[]> => {
    let pays = await this.dynamicRepository.getPaymentsApi(account)
    this.paymentCount.set(pays.length)
    this.LastTransactionTime(pays)
    return pays
  }

  LastTransactionTime(payments: IDCTxnRow[]): void {
    let time = 0
    for (let pay of payments) {
      let eLast = UtilTime.GetEpochFromFormatedDate(pay.created)
      if (eLast > time) time = eLast - ((3600 * 1000) * 6)
    }
    this.iDb.setLocalStorage(lastPayment, String(time))
    UtilTime.DelayPaymentLast(time, eProvider.DynamiCore, this.injector)
  }

  createCustomerDynamicRef = async (
    _client: oClient,
    _contract: oContract
  ) => await this.dynamicRepository.createCustomerDynamicRef(_client, _contract)
}
