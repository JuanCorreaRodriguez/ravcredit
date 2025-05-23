import {EnvironmentInjector, inject, Injectable, runInInjectionContext, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {cBusinessConfig, cBusinessInfo} from '../utils/UtilBusiness';
import {catchError, firstValueFrom} from 'rxjs';
import {ravCreditApiBusinessGetConfig, ravCreditApiBusinessGetInfo} from '../utils/paths';
import {UtilsHttp} from '../utils/UtilsHttp';
import {gResponse} from '../interfaces/oGlobal';
import {oBusinessConfig, oBusinessInfo} from '../interfaces/oBusiness';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  status = signal("")
  error = false

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector,
  ) {
  }

  /****************** BUSINESS INFO *************************************/
  async getLocalInfo() {
    return await this.indexedDbService.GetBusinessInfo()
  }

  async getServerInfo() {
    let info = cBusinessInfo
    try {

      const access_token = await this.indexedDbService.GetToken()

      const response = await firstValueFrom(
        this.httpClient.get(ravCreditApiBusinessGetInfo, {
          headers: UtilsHttp.CreateHeadersApi(access_token)
        }).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const gRes = response as gResponse
      info = gRes.data as oBusinessInfo

      await this.indexedDbService.UpdateBusinessInfo(info)

    } catch (err) {
      await this.catchingError(err)
    }
    return info
  }

  /****************** BUSINESS CONFIG ************************************/
  async getLocalConfig() {
    return await this.indexedDbService.GetBusinessConfig()
  }

  async getServerConfig() {

    let config = cBusinessConfig
    try {

      const access_token = await this.indexedDbService.GetToken()

      const response = await firstValueFrom(
        this.httpClient.get(ravCreditApiBusinessGetConfig, {
          headers: UtilsHttp.CreateHeadersApi(access_token)
        }).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const gRes = response as gResponse
      config = gRes.data as oBusinessConfig

      await this.indexedDbService.UpdateBusinessConfig(config)

    } catch (err) {
      await this.catchingError(err)
    }
    return config
  }

  /********************************** ******************************************/
  async catchingError(err: any) {
    this.status.set("")
    this.error = true
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }
}
