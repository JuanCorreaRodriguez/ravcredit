import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {oClient, oClientReferences} from '../interfaces/oClient';
import {oConektaNewOrder, oConektaOrder} from '../interfaces/oConekta';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {oContract} from '../interfaces/oContract';
import {FactoryConekta} from '../utils/UtilConekta';
import {ravApiConektaCreateOrder} from '../utils/paths';
import {UtilsHttp} from '../utils/UtilsHttp';
import {catchError, firstValueFrom} from 'rxjs';
import {gResponse} from '../interfaces/oGlobal';
import {dbClientsStore} from '../utils/config';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ConektaService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector
  ) {
  }

  async createOrder(
    client: oClient,
    contract: oContract,
    access_token: string,
    dateTime?: number
  ): Promise<boolean> {

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
      if (res == undefined) return false
      return this.saveReferenceLocally(res.data, client)

    } catch (e) {
      await this.catchingError(e)
      return false
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

  async catchingError(err: any) {
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }
}
