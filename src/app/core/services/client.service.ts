import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {cClient} from "../utils/UtilClient";
import {oClient} from "../interfaces/oClient";
import {catchError, firstValueFrom} from 'rxjs';
import {ravCreditApiClient, ravCreditApiClientUpdate, ravCreditApiClientVerifyRavcredit} from '../utils/paths';
import {UtilsHttp} from '../utils/UtilsHttp';
import {gResponse} from '../interfaces/oGlobal';
import {dbClientsStore} from '../utils/config';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly indexedDbService: IndexedDbService,
    private readonly injector: EnvironmentInjector,
  ) {
  }

  async verifyCurpRavcredit(curp: string) {
    try {
      const access_token = await this.indexedDbService.GetToken()
      const obj = {
        curp: curp
      }
      const config = {
        headers: UtilsHttp.CreateHeadersApi(access_token)
      }

      const response = await firstValueFrom(
        this.httpClient
          .post(ravCreditApiClientVerifyRavcredit, obj, config)
          .pipe(
            catchError(err => this.catchingError(err))
          )
      )
      const gRes = response as gResponse
      // client = gRes.data as oClient
      return gRes.data as oClient
    } catch (e) {
      await this.catchingError(e)
      return null
    }
  }

  async updateContractUrl(client: oClient) {
    let c = cClient

    try {
      const contractUrl = {
        contractUrl: client.contractUrl,
      }
      const access_token = await this.indexedDbService.GetToken()
      const response = await firstValueFrom(
        this.httpClient
          .patch(`${ravCreditApiClientUpdate}${client.id}`, contractUrl, {
            headers: UtilsHttp.CreateHeadersApi(access_token)
          })
          .pipe(
            catchError(err => this.catchingError(err)
            )
          )
      )

      const gRes = response as gResponse
      c = gRes.data as oClient
      await this.indexedDbService.UpdateObjectById(dbClientsStore, client.id, client)

    } catch (err) {
      await this.catchingError(err)
    }
    return c
  }

  async getClientById(id: string) {
    let client = cClient

    try {
      const access_token = await this.indexedDbService.GetToken()
      const response = await firstValueFrom(
        this.httpClient.get(ravCreditApiClient + id, {
          headers: UtilsHttp.CreateHeadersApi(access_token)
        }).pipe(
          catchError(err => this.catchingError(err))
        )
      )

      const gRes = response as gResponse
      client = gRes.data as oClient

      await this.indexedDbService.PatchObject(dbClientsStore, client)

    } catch (err) {
      await this.catchingError(err)
    }
    return client
  }

  async getClientByCurp(curp: string, search?: boolean): Promise<oClient | string> {
    let client: oClient = cClient
    try {
      // client = await this.indexedDbService.dbGetObjectCurp<oClient>(dbClientsStore, curp)
      // if (client) return client

      const vCurp = await this.verifyCurpRavcredit(curp)
      client = vCurp ? vCurp : cClient

      if (!client) return ""
      if (client.id == "") return "Available"

      if (search == undefined)
        await this.indexedDbService.UpsertObjectById(dbClientsStore, client.id, client)


      return client

    } catch (err) {
      await this.catchingError(err)
    }
    return client
  }

  async catchingError(err: any) {
    runInInjectionContext(this.injector, () => {
      const errorService = inject(ErrorHandlerService)
      errorService.httpError(err)
    })
  }

  // async initCreateClient(contract: oContract, client: oClient): Promise<oClient> {
  //
  //   let _client = cClient
  //
  //   try {
  //     if (contract.by == "")
  //       contract.by = await this.indexedDbService.dbGetPlatformUser()
  //
  //     const resClient = await this.createClient(client)
  //
  //     if (resClient.exists) {
  //       return resClient
  //     } else {
  //       if (!resClient.contract_temporary) await this.catchingError("ID de contrato no generado")
  //       if (resClient.id != "") _client = resClient
  //     }
  //   } catch (err) {
  //     await this.catchingError(err)
  //   }
  //   return _client
  // }

  // async createClient(client: oClient) {
  //   let c = cClient
  //   try {
  //     const access_token = await this.indexedDbService.dbGetToken()
  //     client.name = client.name.toLowerCase()
  //
  //     const response = await firstValueFrom(
  //       this.httpClient
  //         .post(ravCreditApiClientCreate, client, {
  //           headers: UtilsHttp.CreateHeadersApi(access_token)
  //         })
  //         .pipe(catchError(err => {
  //             throw this.catchingError(err)
  //           })
  //         )
  //     )
  //
  //     const gRes = response as gResponse
  //     c = gRes.data as oClient
  //
  //     await this.indexedDbService.dbAddObject(dbClientsStore, c)
  //   } catch (err) {
  //     await this.catchingError(err)
  //   }
  //   return c
  // }

  // async updateClient(client: Partial<oClient>, id?: string) {
  //   let c = cClient
  //
  //   try {
  //     if (!id) id = client.id
  //
  //     const access_token = await this.indexedDbService.dbGetToken()
  //
  //     const response = await firstValueFrom(
  //       this.httpClient
  //         .patch(`${ravCreditApiClientUpdate}${id}`, client, {
  //           headers: UtilsHttp.CreateHeadersApi(access_token)
  //         })
  //         .pipe(
  //           catchError(err => this.catchingError(err)
  //           )
  //         )
  //     )
  //
  //     const gRes = response as gResponse
  //     c = gRes.data as oClient
  //
  //     await this.indexedDbService.dbPatchObject<oClient>(dbClientsStore, client)
  //   } catch (err) {
  //     await this.catchingError(err)
  //   }
  //   return c
  // }

  // async getAllClients(access_token: string) {
  //   let clients: oClient[] = []
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpClient.get(ravCreditApiClient, {
  //         headers: UtilsHttp.CreateHeadersApi(access_token)
  //       }).pipe(
  //         catchError(err => this.catchingError(err))
  //       )
  //     )
  //
  //     const gRes = response as gResponse
  //     clients = gRes.data as oClient[]
  //
  //     if (clients.length > 0)
  //       await this.indexedDbService.cleanAll(dbClientsStore)
  //
  //     await this.indexedDbService.dbAddBuildByStore(dbClientsStore, clients)
  //
  //   } catch (err) {
  //     await this.catchingError(err)
  //   }
  //   return clients
  // }

  // async removeClient(token: string, client: string | undefined): Promise<boolean> {
  //   try {
  //     await firstValueFrom(
  //       this.httpClient.delete(ravCreditApiClient + client, {
  //         headers: UtilsHttp.CreateHeadersApi(token)
  //       }).pipe(
  //         catchError(err => {
  //           throw this.catchingError(err)
  //         })
  //       )
  //     )
  //     await this.indexedDbService.dbDeleteObjectByID(dbClientsStore, client!)
  //     return true
  //   } catch (err) {
  //     await this.catchingError(err)
  //     return false
  //   }
  // }

  // async updateClientAccess(client: Partial<oClient>, id: string) {
  //   let c = cClient
  //
  //   try {
  //     const access_token = await this.indexedDbService.dbGetToken()
  //
  //     const response = await firstValueFrom(
  //       this.httpClient
  //         .patch(`${ravCreditApiClientUpdateAppAccess}${id}`, client, {
  //           headers: UtilsHttp.CreateHeadersApi(access_token)
  //         })
  //         .pipe(
  //           catchError(err => this.catchingError(err)
  //           )
  //         )
  //     )
  //     const gRes = response as gResponse
  //     c = gRes.data as oClient
  //     // await this.indexedDbService.dbPatchObject<oClient>(dbClientsStore, c)
  //   } catch (err) {
  //     await this.catchingError(err)
  //   }
  //   return c
  // }

}
