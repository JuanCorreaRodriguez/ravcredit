import {EnvironmentInjector, inject, Injectable, runInInjectionContext, signal} from '@angular/core';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {oUser} from '../interfaces/oUser';
import {dbAuthStore, lastPayment} from '../utils/config';
import {ContractService} from './contract.service';
import {ClientService} from './client.service';
import {oClient} from '../interfaces/oClient';
import {oContract} from '../interfaces/oContract';
import {BusinessService} from './business.service';
import {oBusinessConfig, oBusinessInfo} from '../interfaces/oBusiness';
import {ObservablesService} from './observables.service';
import {UtilTime} from '../utils/UtilTime';
import {Router} from '@angular/router';
import {RouteData, RoutingParams} from '../utils/globals';
import {DynamicService} from './dynamic.service';
import {IDCGeneratedReference} from '../utils/UtilDynamiCore';
import {cClient} from '../utils/UtilClient';
import {NotificationService} from './notification.service';
import {oNotification} from '../interfaces/oNotification';
import {oConektaOrder} from '../interfaces/oConekta';
import {ConektaService} from './conekta.service';
import {eProvider} from '../utils/UtilContract';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  client = signal<oClient>(cClient)
  injector = inject(EnvironmentInjector)

  constructor(
    private readonly idbService: IndexedDbService,
    private readonly clientsService: ClientService,
    private readonly contractService: ContractService,
    private readonly businessService: BusinessService,
    private readonly observables: ObservablesService
  ) {
  }

  async signOutDB() {
    await this.idbService.SignOut()
  }

  async getLocalUserApp() {
    let id = this.idbService.getLocalUser()
    return this.idbService.GetObject<oUser>(dbAuthStore, id)
  }

  async getLocalCustomerData(session: string) {
    let clientContract = await this.idbService.GetClientContract(session)

    let _client: oClient
    let _contract: oContract

    if (clientContract.id == undefined) {
      _client = await this.getServerClient(session)
      this.client.set(_client)
      _contract = await this.getServerContract(session)
      clientContract = {..._client, ..._contract}
      clientContract.id = _client.id
      clientContract.status = _client.status
    }

    return clientContract
  }

  async GetBusinessInfo() {
    let businessInfo = await this.idbService.GetBusinessInfo();
    if (!businessInfo) businessInfo = await this.getServerBusinessInfo()
    return businessInfo
  }

  async GetBusinessConfig() {
    let businessConf = await this.idbService.GetBusinessConfig();
    if (!businessConf) businessConf = await this.getServerBusinessConfig()
    return businessConf
  }

  GetContractFromRoute(router: Router): oContract | undefined {
    let data: RoutingParams = router.getCurrentNavigation()?.extras.state as RoutingParams

    return data.contract
  }

  async GetReferenceDynamic(id: string): Promise<IDCGeneratedReference | null> {
    return await runInInjectionContext(this.injector, async () => {
      let service = inject(DynamicService)
      return await service.getReference(id)
    })
  }

  async GetOrderConekta(account: string): Promise<oConektaOrder> {
    return await runInInjectionContext(this.injector, async () => {
      let service = inject(ConektaService)
      return service.getOrder(account)
    })
  }

  GetDataFromRoute<T>(router: Router, type: RouteData): T | undefined {
    let data: RoutingParams = router.getCurrentNavigation()?.extras.state as RoutingParams

    switch (type) {

      case RouteData.CLIENT:
        return data.client as T

      case RouteData.CONTRACT:
        return data.contract as T

      case RouteData.REFERENCE:
        return data.reference as T

      case RouteData.ID:
        return data.id as T

      case RouteData.EXTERNAL_ID:
        return data.external_id as T

      case RouteData.PAYMENT_DYNAMIC:
        return data.paymentDynamic as T

      case RouteData.PAYMENT_CONEKTA:
        return data.orderConekta as T

      default:
        return undefined
    }
  }

  GetLastPayment(provider: string) {
    let _lastPayment = Number(this.idbService.getLocalStorage<number>(lastPayment))
    if (provider == eProvider.Conekta) _lastPayment /= 1000
    return UtilTime.getLocalTimeFromLong(_lastPayment, provider)
  }

  GetNextPayment(contract: oContract): string {
    let _lastPayment = Number(this.idbService.getLocalStorage<number>(lastPayment))
    if (contract.financial.provider == eProvider.Conekta) _lastPayment /= 1000
    if (_lastPayment <= 0) return ''
    return UtilTime.GetNextPayment(_lastPayment, contract.financial.provider)
  }

  GetProgressDynamic(transactions: number, weeks: number): number {
    if (transactions == 0 || weeks == 0) return 0
    let progress = (transactions / weeks) * 100;
    return Number(progress.toFixed(2))
  }

  async GetGlobalNotifications(): Promise<oNotification[]> {
    return await runInInjectionContext(this.injector, async () => {
      const service = inject(NotificationService)
      let notifications = await service.getLocalNotifications()
      if (notifications.length <= 0) notifications = await service.getServerNotifications()

      return notifications
    })

  }

  getServerBusinessConfig = async (): Promise<oBusinessConfig> =>
    await this.businessService.getServerConfig()

  getServerBusinessInfo = async (): Promise<oBusinessInfo> =>
    await this.businessService.getServerInfo()

  getServerContract = async (session: string): Promise<oContract> =>
    await this.contractService.getContractByClientApi(session)

  getServerClient = async (session: string): Promise<oClient> =>
    await this.clientsService.getClientById(session)

  getServerNotifications = async (): Promise<oNotification[]> => {
    return runInInjectionContext(this.injector, async () => {
      const service = inject(NotificationService)
      return await service.getServerNotifications()
    })
  }
}
