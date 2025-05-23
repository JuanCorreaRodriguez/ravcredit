import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {oClient} from '../interfaces/oClient';
import {oContract} from '../interfaces/oContract';
import {ClientService} from './client.service';
import {catchError, firstValueFrom} from 'rxjs';
import {FactoryPassport} from '../utils/UtilPassport';
import {ravApiPassportCreateRef} from '../utils/paths';
import {UtilsHttp} from '../utils/UtilsHttp';
import {gResponse} from '../interfaces/oGlobal';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector,
    private readonly clientService: ClientService
  ) {
  }

  /* Generate Client in passport */
  async createReferencePassport(
    _client: oClient,
    _contract: oContract,
    access_token: string,
    dateTime?: number
  ): Promise<boolean> {
    try {
      /** Generate reference for lifetime passport (+4 weeks) */
      await this.initPassportCustomer(_client, _contract, access_token, dateTime)
      await this.clientService.getClientById(_client.id)
      return true
    } catch (e) {
      return false
    }
  }

  async initPassportCustomer(client: oClient, contract: oContract, access_token: string, dateTime?: number) {
    try {
      const passportObj = FactoryPassport.CreatePassportReference(client, contract, dateTime)
      const response = await firstValueFrom(
        this.httpClient.post(ravApiPassportCreateRef, passportObj, {
          headers: UtilsHttp.CreateHeadersApi(access_token)
        }).pipe(
          catchError(err => {
            throw this.catchingError(err)
          })
        )
      )

      const gRes = response as gResponse
      return gRes.data

    } catch (err) {
      await this.catchingError(err)
      return null
    }
  }

  async catchingError(err: any) {
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }
}
