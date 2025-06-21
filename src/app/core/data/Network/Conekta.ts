import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IDCTxnRow} from '../../utils/UtilDynamiCore';
import {dbClientsStore, dbDynamicReferencesStore, dbPaymentsStore} from '../../utils/config';
import {UtilsHttp} from '../../utils/UtilsHttp';
import {catchError, firstValueFrom} from 'rxjs';
import {IndexedDbService} from '../../indexed-db/indexed-db.service';
import {oConektaNewOrder, oConektaOrder, oConektaOrdersResponse} from '../../interfaces/oConekta';
import {ravApiConektaCreateOrder, ravApiConektaGetOrdersById} from '../../utils/paths';
import {gResponse} from '../../interfaces/oGlobal';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {ObservablesService} from '../../services/observables.service';
import {oClient, oClientReferences} from '../../interfaces/oClient';
import {oContract} from '../../interfaces/oContract';
import {FactoryConekta} from '../../utils/UtilConekta';

@Injectable({
  providedIn: 'root'
})
export class ConektaRepository {

  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly injector: EnvironmentInjector = inject(EnvironmentInjector);
  private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);

  async getPayment(id: string) {
    return await this.indexedDbService.GetObject<oConektaOrdersResponse>(dbPaymentsStore, id)
  }

  async getPaymentApi(id: string): Promise<IDCTxnRow | null> {
    let payment: oConektaOrdersResponse | null = null

    try {
      const access_token = await this.indexedDbService.GetToken()
      const headers = {
        headers: UtilsHttp.CreateHeadersApi(access_token),
      }
      const snap = await firstValueFrom(
        this.httpClient.get(``)
      )
    } catch (e) {
      console.log("error getting payment", e)
    }

    return payment
  }

  async getPayments(account: string): Promise<oConektaOrder[]> {
    return await this.indexedDbService.GetAllByStore<oConektaOrder[]>(dbPaymentsStore)
  }

  async getPaymentsApi(account: string): Promise<oConektaOrder[]> {
    let payments: oConektaOrder[] = []
    try {
      const access_token = await this.indexedDbService.GetToken()
      const headers = {
        headers: UtilsHttp.CreateHeadersApi(access_token)
      }
      const snap = await firstValueFrom(
        this.httpClient.get(
          `${ravApiConektaGetOrdersById}/${account}`,
          headers
        ).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const res = snap as gResponse
      if (!res.data) return payments

      // const filtering = this.filterPayments(res.data as IDCTxnRow[])
      // let data: IDCTxnRow[] = filtering()
      let data = res.data

      if (data.length > 0) payments = data

      await this.saveLocalPayments(data)
      // await this.OrdersLoaded(true)
    } catch (e) {
      console.log("Catch error payment api", e)
    }
    return payments
  }

  async OrdersLoaded(val: boolean) {
    runInInjectionContext(this.injector, () => {
      const service = inject(ObservablesService)
      service.ConektaOrdersLoaded.next(val)
    })
  }

  async createConektaOrderRef(
    _client: oClient,
    _contract: oContract,
    dateTime?: number
  ): Promise<oClient | null> {
    try {

      const access_token = await this.indexedDbService.GetToken()

      const orderRes: gResponse | null =
        await this.createOrder(_client, _contract, access_token, dateTime)

      if (!orderRes) return null

      const ref = orderRes.data as oConektaOrder

      const references: oClientReferences = {
        id: ref.id,
        amount: ref.amount,
        date: new Date().getTime(),
      };


      if (_client.references)
        _client.references.push(references)
      else
        _client.references = [references]

      _client.reference = ref.charges.data[0].payment_method.reference

      await this.indexedDbService.UpdateObject(dbClientsStore, _client)
      await this.indexedDbService.AddObject(dbDynamicReferencesStore, ref)
      return _client

    } catch (e) {
      return null
    }
  }

  async createOrder(
    client: oClient,
    contract: oContract,
    access_token: string,
    dateTime?: number
  ): Promise<gResponse | null> {

    try {
      const data: oConektaNewOrder = FactoryConekta.createOrder(client, contract, dateTime)
      const url = `${ravApiConektaCreateOrder}`
      const headers = UtilsHttp.CreateHeadersApi(access_token)

      const snap = await firstValueFrom(
        this.httpClient.post(url, JSON.stringify(data), {
          headers: headers
        }).pipe(
          catchError(err => this.catchingError(err))
        )
      ) //ord_2xgQfKcbTCUUNntfR
      const res = snap as gResponse
      console.log("creating order", res)
      if (res == undefined) return null

      await this.saveReferenceLocally(res.data, client)
      return res

    } catch (e) {
      await this.catchingError(e)
      return null
    }
  }

  async saveReferenceLocally(order: oConektaOrder, client: oClient): Promise<boolean> {
    const amount = order.charges.data[0].amount
    const date = order.charges.data[0].created_at
    const id = order.charges.data[0].order_id

    const referenceH: oClientReferences = {
      amount: amount, date: date, id: id
    }
    client.references?.push(referenceH)
    client.reference = order.charges.data[0].payment_method.reference
    return await this.indexedDbService.AddObject<oClient>(dbClientsStore, client)
  }

  /* Create customer reference */
  async catchingError(err: any) {
    // this.status.set("")
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }

  async saveLocalPayments(payments: oConektaOrdersResponse[]) {
    try {
      await this.indexedDbService.AddAllObjects(dbPaymentsStore, payments)
    } catch (e) {
      console.log(e)
    }
  }

  filterPayments(payments: IDCTxnRow[]): () => IDCTxnRow[] {
    const data: IDCTxnRow[] = []
    let memory: Map<string, string> = new Map()

    return function (): IDCTxnRow[] {
      for (const payment of payments) {
        const key = payment.id

        if (memory.has(key)) continue

        if (
          (payment.name.includes("SPEI") || payment.name.includes("Pago de Amortización")) &&
          payment.debit > 0
        ) {
          data.push(payment)
          memory.set(payment.id, payment.id)
        }
      }

      return data

    }
  }

}

// prev
// cus_2yBQcX8d8qwMLYkMB
// new
// cus_2yCRwCCSUc4SdZPVd
