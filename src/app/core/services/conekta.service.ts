import {EnvironmentInjector, inject, Injectable, runInInjectionContext, signal} from '@angular/core';
import {oClient} from '../interfaces/oClient';
import {oConektaOrder} from '../interfaces/oConekta';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {oContract} from '../interfaces/oContract';
import {ErrorHandlerService} from './error-handler.service';
import {UtilTime} from '../utils/UtilTime';
import {ConektaRepository} from '../data/Network/Conekta';
import {lastPayment} from '../utils/config';
import {eProvider} from '../utils/UtilContract';

@Injectable({
  providedIn: 'root'
})
export class ConektaService {

  status = signal<string>("")
  paymentCount = signal<number>(0)

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector,
    private readonly conektaRepository: ConektaRepository,
    private readonly iDb: IndexedDbService
  ) {
  }

  async getOrder(account: string): Promise<oConektaOrder> {
    let pays = await this.conektaRepository.getPayments(account)
    if (pays.length == 0) pays = await this.conektaRepository.getPaymentsApi(account)
    pays = UtilTime.SortingByTimeConekta(pays)
    return pays[0]
  }

  async getPaymentLocal(account: string) {
    return await this.conektaRepository.getPayments(account)
  }

  getPayments = async (
    account: string
  ): Promise<oConektaOrder[]> => {
    let pays = await this.conektaRepository.getPayments(account)
    if (pays.length == 0) pays = await this.conektaRepository.getPaymentsApi(account)
    pays = UtilTime.SortingByTimeConekta(pays)

    let count = 0;

    for (let pay of pays) if (pay.payment_status == "paid") count++

    this.paymentCount.set(count)
    this.LastTransactionTime(pays)
    return pays
  }

  LastTransactionTime(payments: oConektaOrder[]): void {
    let time = 0
    for (let pay of payments) {

      let paidAt = 0

      if (pay.payment_status == "pending_payment")
        paidAt = pay.charges.data[0].created_at
      else
        paidAt = pay.charges.data[0].paid_at

      let t = (paidAt - ((3600 * 1000) * 6))
      time = Math.max(t, paidAt)
      time *= 1000
    }
    this.indexedDbService.removeLocalStorage(lastPayment)
    this.indexedDbService.setLocalStorage(lastPayment, String(time))
    UtilTime.DelayPaymentLast(time, eProvider.Conekta, this.injector)
  }

  async initConektaCreateOrder(
    client: oClient,
    contract: oContract
  ): Promise<oClient | null> {

    if (client.references != null && client.references.length > 0) {
      let last = client.references.length - 1
      if (client.references[last].date) {
        // return this.dynamicRepository.initDynamicCreateReference(client, contract, client.references[last].date)
        return await this.conektaRepository.createConektaOrderRef(client, contract, client.references[last].date)
      }
    }
    return await this.conektaRepository.createConektaOrderRef(client, contract)
    // return this.dynamicRepository.initDynamicCreateReference(client, contract)
  }

  async catchingError(err: any) {
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }
}
