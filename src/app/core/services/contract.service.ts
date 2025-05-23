import {EnvironmentInjector, inject, Injectable, runInInjectionContext, signal} from '@angular/core';
import {oClient} from '../interfaces/oClient';
import {cContract, eProvider} from '../utils/UtilContract';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {oContract} from '../interfaces/oContract';
import {catchError, firstValueFrom} from 'rxjs';
import {UtilsHttp} from '../utils/UtilsHttp';
import {gResponse, snackBarConfigNoAction} from '../interfaces/oGlobal';
import {dbContractsStore} from '../utils/config';
import {NavService} from './nav.service';
import {ErrorHandlerService} from './error-handler.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientService} from './client.service';
import {ravCreditApiContract, ravCreditApiContractByClient} from '../utils/paths';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  status = signal<string>("")
  error = false
  progress = signal(0)

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector,
    private readonly snackbar: MatSnackBar,
    private readonly clientsService: ClientService
  ) {
  }

  async getContractByID(id: string): Promise<oContract> {
    let contract: oContract = cContract
    try {
      contract = await this.indexedDbService.GetObject<oContract>(dbContractsStore, id)

      if (!contract) return await this.getContractByIDApi(id)

    } catch (e) {
      await this.catchingError(e)
    }
    return contract
  }

  async getContractByIDApi(id: string) {
    console.info("Getting contract with id API", id)
    let contract = cContract
    try {
      const access_token = await this.indexedDbService.GetToken()
      const response = await firstValueFrom(
        this.httpClient.get(ravCreditApiContract + "/" + id, {
          headers: UtilsHttp.CreateHeadersApi(access_token)
        }).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const gRes = response as gResponse
      contract = gRes.data as oContract

      if (contract)
        await this.indexedDbService.UpsertObjectById(dbContractsStore, contract.id, contract)

    } catch (err) {
      await this.catchingError(err)
    }
    return contract
  }

  async getContractByClientApi(id: string) {
    let contract = cContract
    try {
      const access_token = await this.indexedDbService.GetToken()
      const response = await firstValueFrom(
        this.httpClient.get(ravCreditApiContractByClient + "/" + id, {
          headers: UtilsHttp.CreateHeadersApi(access_token)
        }).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const gRes = response as gResponse
      contract = gRes.data as oContract

      if (contract)
        await this.indexedDbService.UpsertObjectById(dbContractsStore, contract.id, contract)

    } catch (err) {
      await this.catchingError(err)
    }
    return contract
  }

  async syncClient(client: oClient, provider: string) {
    if (client.id == "") return

    if (provider == eProvider.Passport)
      await this.clientsService.getClientById(client.id)
  }

  async completed(client: oClient) {
    this.status.set("")

    this.snackbar.open(`Se registro correctamente a ${client.name} en RavCredit`, "", snackBarConfigNoAction)

    runInInjectionContext(this.injector, () => {
      const service = inject(NavService)
      service.routing(`save-contract/${client.id}`)
    })
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
