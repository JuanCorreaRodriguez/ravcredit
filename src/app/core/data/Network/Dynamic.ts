import {FactoryDynamiCore, IDCAccount, IDCGeneratedReference, IDCTxnRow} from '../../utils/UtilDynamiCore';
import {UtilsHttp} from '../../utils/UtilsHttp';
import {catchError, firstValueFrom} from 'rxjs';
import {
  ravApiDynamicCoreRef,
  ravCreditApiAccountVerifyDynamic,
  ravCreditApiGetReferenceDynamic,
  ravCreditApiGetTransactions
} from '../../utils/paths';
import {gResponse} from '../../interfaces/oGlobal';
import {HttpClient} from '@angular/common/http';
import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {IndexedDbService} from '../../indexed-db/indexed-db.service';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {oClient, oClientReferences} from '../../interfaces/oClient';
import {oContract} from '../../interfaces/oContract';
import {
  dbClientsStore,
  dbDynamicAccountStore,
  dbDynamicReferencesStore,
  dbPaymentsStore,
  keyPathDynamicReference
} from '../../utils/config';
import {ObservablesService} from '../../services/observables.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicRepository {

  constructor(
    private readonly httpClient: HttpClient,
    private injector: EnvironmentInjector,
    private readonly indexedDbService: IndexedDbService,
    private readonly observables: ObservablesService
  ) {
  }

  async getDynamicAccount(id: string): Promise<IDCAccount | null> {
    try {
      return await this.indexedDbService.GetObjectByID<IDCAccount>(dbDynamicAccountStore, id)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getDynamicAccountApi(
    id: string | number,
    _path?: string
  ): Promise<IDCAccount | null> {
    try {
      let path = "client"
      if (_path) path = _path
      const access_token = await this.indexedDbService.GetToken()

      const config = {
        headers: UtilsHttp.CreateHeadersApi(access_token),
      }

      const response = await firstValueFrom(
        this.httpClient.get(
          `${ravCreditApiAccountVerifyDynamic}/${id}/${path}`,
          config
        ).pipe(
          catchError(err => this.catchingError(err))
        )
      )
      const gRes = response as gResponse
      const account = gRes.data as IDCAccount

      //change id to string
      account.id = String(account.id)

      if (account.id != "") {
        await this.saveDataLocal(dbDynamicAccountStore, account)
        return account
      }

      return null
    } catch (e) {
      await this.catchingError(e)
      return null
    }
  }

  async initDynamicCreateReference(
    client: oClient,
    contract: oContract,
    dateTime?: number
  ): Promise<gResponse | null> {
    try {
      const access_token = await this.indexedDbService.GetToken()

      const bodyReference =
        FactoryDynamiCore.CreateReferenceBody(client, contract, dateTime)

      console.log("bodyReference", bodyReference)

      if (!bodyReference) return null

      const response = await firstValueFrom(
        this.httpClient.post(
          ravApiDynamicCoreRef,
          bodyReference, {
            headers: UtilsHttp.CreateHeadersApi(access_token)
          }
        ).pipe(
          catchError(e => {
            throw this.catchingError(e)
          })
        )
      )
      const gRes = response as gResponse
      // const gRes: gResponse = this.testOrder // Test Object
      if (gRes != undefined) {
        await this.saveReferenceLocally(gRes.data, client)
        return gRes
      } else return null

    } catch (e) {
      await this.catchingError(e)
      return null
    }
  }

  async getReference(reference: string): Promise<IDCGeneratedReference | null> {
    try {
      return this.indexedDbService.GetObjectByID<IDCGeneratedReference>(
        dbDynamicReferencesStore,
        reference,
        keyPathDynamicReference
      )
    } catch (e) {
      return null
    }
  }

  async getReferenceApi(id: string): Promise<IDCGeneratedReference | null> { //ravCreditApiGetReferenceDynamic
    try {
      const access_token = await this.indexedDbService.GetToken()

      const config = {
        headers: UtilsHttp.CreateHeadersApi(access_token),
      }

      const response = await firstValueFrom(
        this.httpClient.get(
          `${ravCreditApiGetReferenceDynamic}/${id}`,
          config
        ).pipe(
          catchError(err => this.catchingError(err))
        )
      )
      const gRes = response as gResponse
      if (!gRes.data) return null
      const data = gRes.data as IDCGeneratedReference

      if (data != undefined) {
        await this.indexedDbService.AddObject(dbDynamicReferencesStore, data)
        return data
      }

      return null
    } catch (e) {
      await this.catchingError(e)
      return null
    }
  }

  async getPayment(id: string) {
    return await this.indexedDbService.GetObject<IDCTxnRow>(dbPaymentsStore, id)
  }

  async getPaymentApi(id: string): Promise<IDCTxnRow | null> {
    let payment: IDCTxnRow | null = null

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

  async getPayments(account: number): Promise<IDCTxnRow[]> {
    return await this.indexedDbService.GetAllByStore<IDCTxnRow[]>(dbPaymentsStore)
  }

  async getPaymentsApi(account: number): Promise<IDCTxnRow[]> {
    let payments: IDCTxnRow[] = []
    try {
      // account = 92280
      const access_token = await this.indexedDbService.GetToken()
      const headers = {
        headers: UtilsHttp.CreateHeadersApi(access_token)
      }
      const snap = await firstValueFrom(
        this.httpClient.get(
          `${ravCreditApiGetTransactions}/${account}`,
          headers
        ).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const res = snap as gResponse

      if (!res.data) return payments

      const filtering = this.filterPayments(res.data as IDCTxnRow[])
      const data: IDCTxnRow[] = filtering()

      console.log("getPaymentsApi \n", data)

      if (data.length > 0) payments = data

      await this.saveLocalPayments(data)
      this.observables.DynamicPaymentLoaded.next(true)
    } catch (e) {
      console.log("Catch error payment api", e)
    }
    return payments
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

  async saveLocalPayments(payments: IDCTxnRow[]) {
    try {
      await this.indexedDbService.AddAllObjects(dbPaymentsStore, payments)
    } catch (e) {
      console.log(e)
    }
  }

  async createCustomerDynamicRef(
    _client: oClient,
    _contract: oContract,
    dateTime?: number
  ): Promise<oClient | null> {
    try {
      const dynamicRes: gResponse | null =
        await this.initDynamicCreateReference(_client, _contract, dateTime)

      if (!dynamicRes) return null

      const ref = dynamicRes.data as IDCGeneratedReference

      const references: oClientReferences = {
        id: ref.id,
        amount: ref.amount,
        date: new Date().getTime(),
      };

      if (_client.references)
        _client.references.push(references)
      else
        _client.references = [references]

      _client.reference = ref.charge.reference

      await this.indexedDbService.UpdateObject(dbClientsStore, _client)
      await this.indexedDbService.AddObject(dbDynamicReferencesStore, ref)
      return _client
    } catch (e) {
      return null
    }
  }

  async saveReferenceLocally(order: IDCGeneratedReference, client: oClient): Promise<boolean> {

    const amount = order.amount
    const date = new Date().getTime()
    const id = order.id

    const referenceH: oClientReferences = {
      amount: amount, date: date, id: id
    }
    client.references?.push(referenceH)
    client.reference = order.charge.reference
    return await this.indexedDbService.UpsertObjectById<oClient>(dbClientsStore, client.id, client)
  }

  /* Create customer reference */
  async catchingError(err: any) {
    // this.status.set("")
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }

  async saveDataLocal<T>(store: string, data: T) {
    try {
      await this.indexedDbService.AddObject<T>(store, data)
    } catch (e) {
      console.info("Catch error saving local'\n", e)
    }
  }
}
