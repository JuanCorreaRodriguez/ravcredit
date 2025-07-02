import {EnvironmentInjector, inject, Injectable, runInInjectionContext, signal, WritableSignal} from '@angular/core';
import {oAuth} from '../interfaces/oLogIn';
import {eLoginStatus, gResponse} from '../interfaces/oGlobal';
import {ravCreditApiUsers} from '../utils/paths';
import {dbAuthStore} from '../utils/config';
import {dbIncorrectPassword, dbUsernameClientNotFound, dbUsernameNotFound} from '../utils/messages';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  status: WritableSignal<eLoginStatus> = signal(eLoginStatus.IDLE)

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector
  ) {
  }

  async initLogin(credentials: oAuth) {
    try {
      this.status.set(eLoginStatus.CHECKING)

      this.httpClient.post(ravCreditApiUsers, {
        "username": String(credentials.username),
        "password": credentials.password
      }).subscribe({
        next: async (e) => {

          const response = e as gResponse
          const data = response.data

          if (response.error) {
            switch (response.error) {
              case dbUsernameNotFound:
                this.status.set(eLoginStatus.NOAUTHORIZED)
                break

              case dbIncorrectPassword:
                this.status.set(eLoginStatus.ERRORPASSWORD)
                break

              case dbUsernameClientNotFound:
                this.status.set(eLoginStatus.NOTFOUND)
                break
            }
            return
          }

          if (response.status) {
            await this.indexedDbService.dbSignIn(dbAuthStore, data)
            this.status.set(eLoginStatus.AUTHORIZED)
            return
          }
        },
        error: (err) => {
          this.catchingError(err)
        }
      })
    } catch (err) {
      this.status.set(eLoginStatus.ERROR)
    }
  }

  catchingError(err: any) {
    this.status.set(eLoginStatus.ERROR)
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }
}
