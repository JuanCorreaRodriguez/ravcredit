import {EnvironmentInjector, inject, Injectable, runInInjectionContext, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {oNotification} from '../interfaces/oNotification';
import {catchError, firstValueFrom} from 'rxjs';
import {ravCreditApiNotifications} from '../utils/paths';
import {UtilsHttp} from '../utils/UtilsHttp';
import {gResponse} from '../interfaces/oGlobal';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  status = signal("")
  error = false

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector
  ) {
  }

  async getLocalNotifications() {
    return await this.indexedDbService.getLocalNotifications()
  }

  async getServerNotifications() {
    let info: oNotification[] = []
    try {
      const access_token = await this.indexedDbService.GetToken()

      const response = await firstValueFrom(
        this.httpClient.get(ravCreditApiNotifications, {
          headers: UtilsHttp.CreateHeadersApi(access_token)
        }).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const gRes = response as gResponse

      if (gRes.data == undefined) return []

      info = gRes.data as oNotification[]

      const dataRes = info.map((e) => {
        e.notification_id = new Date(e.data.time).getTime()
      })

      await this.indexedDbService.updateNotifications(info)

    } catch (err) {
      await this.catchingError(err)
    }
    return info
  }

  async catchingError(err: any) {
    this.status.set("")
    this.error = true
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }
}
