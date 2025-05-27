import {EnvironmentInjector, inject, runInInjectionContext, signal} from '@angular/core';
import {DashboardService} from '../services/dashboard.service';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {oClient} from '../interfaces/oClient';
import {oContract} from '../interfaces/oContract';
import {cContract, eProvider, FactoryContract} from '../utils/UtilContract';
import {oBusinessConfig, oBusinessInfo} from '../interfaces/oBusiness';
import {DynamicService} from '../services/dynamic.service';
import {IDCAccount, IDCGeneratedReference, IDCTxnRow} from '../utils/UtilDynamiCore';
import {oConektaRes} from '../interfaces/oConekta';
import {ConektaService} from '../services/conekta.service';
import {PassportService} from '../services/passport.service';
import {cClient, FactoryClient} from '../utils/UtilClient';
import {cBusinessConfig, cBusinessInfo} from '../utils/UtilBusiness';
import {oNotification} from '../interfaces/oNotification';

export class Dashboard {
  dashService = inject(DashboardService)
  iDB = inject(IndexedDbService)
  count = 0

  client = signal<oClient>(cClient)
  contract = signal<oContract>(cContract)
  businessConfig = signal<oBusinessConfig>(cBusinessConfig)
  businessInfo = signal<oBusinessInfo>(cBusinessInfo)
  session = signal<string | null>(null)
  progress = signal<number>(0)
  paymentsCount = signal<number>(0)
  isMobile = signal(true)

  dynamicAccount = signal<IDCAccount | null>(null)
  dynamicRef = signal<IDCGeneratedReference | null>(null)
  dynamicPays = signal<IDCTxnRow[]>([])

  conektaAccount = signal<oConektaRes | null>(null)

  notifications = signal<oNotification[]>([])

  injector = inject(EnvironmentInjector)

  async signOutApp() {
    await this.dashService.signOutDB()
  }

  localSession = () => this.session.set(this.iDB.getLocalUser())

  async loadAppUser() {
    return await this.dashService.getLocalUserApp()
  }

  async getGlobalData(): Promise<void> {
    let clientContract = await this.dashService.getLocalCustomerData(this.session()!)

    let businessInfo = await this.dashService.GetBusinessInfo()
    let businessConfig = await this.dashService.GetBusinessConfig()

    let client = FactoryClient.MapperTypeContCli_Client(clientContract)
    let contract = FactoryContract.MapperTypeContCli_Contract(clientContract)

    this.client.set(client)
    this.contract.set(contract)
    this.businessInfo.set(businessInfo)
    this.businessConfig.set(businessConfig)

    let _notifications = await this.dashService.GetGlobalNotifications()
    this.notifications.set(_notifications)

    // if (clientContract.id == "" && this.count < 3) {
    //   await this.getAllServer()
    //   return
    // }

    // if (!businessConf) businessConf = await this.getBusinessConfigServer()

    // if (!businessInfo) businessInfo = await this.getBusinessInfoServer()

    // this.businessInfo.set(businessInfo!)
    // this.businessConfig.set(businessConf!)
  }

  async checkProvider(sync?: boolean) {
    switch (this.contract().financial.provider) {

      case eProvider.DynamiCore:
        await this.dynamicProvider(String(this.client().dynamic_account), String(this.client().reference), sync)
        break

      case eProvider.Conekta:
        await this.conektaProvider(this.client().conekta_id!);
        break
    }
  }

  async dynamicProvider(account?: string, reference?: string, sync?: boolean) {
    await runInInjectionContext(this.injector, async () => {
      let service = inject(DynamicService)

      if (sync) {

        if (account) {
          this.dynamicAccount.set(await service.getDynamicAccountApi(account, "id"))
          await service.getPaymentsApi(Number(account))
        }
        if (reference) {
          this.dynamicRef.set(await service.getReferenceApi(reference))
          await service.getReferenceApi(reference)
        }

      } else {

        if (account) {
          this.dynamicAccount.set(await service.getDynamicAccount(account, "id"))
          let e = await service.getPayments(Number(account))
          this.dynamicPays.set(e)
        }

        if (reference) {
          this.dynamicRef.set(await service.getReference(reference))
          await service.getReference(reference)
        }

      }

      this.progress.set(
        this.dashService.GetProgressDynamic(service.paymentCount(), this.contract().financial.deadlines.weeks))

      this.paymentsCount.set(service.paymentCount())
    })
  }

  async conektaProvider(id: string) {
    await runInInjectionContext(this.injector, async () => {
      let service = inject(ConektaService)

    })
  }

  async passportProvider(id: string) {
    await runInInjectionContext(this.injector, async () => {
      let service = inject(PassportService)

    })
  }

  async getAllServer() {
    if (!this.session()) {
      this.notSessionFound().then()
      return
    }
    await this.dashService.getServerClient(this.session()!)
    await this.dashService.getServerContract(this.session()!)
    await this.dashService.GetBusinessInfo()
    await this.dashService.GetBusinessConfig()
    await this.checkProvider(true)
  }

  //
  // async getAllServer() {
  //   if (!this.session()) {
  //     this.notSessionFound().then()
  //     return
  //   }
  //
  //   let client = await this.dashService.getServerClient(this.session()!)
  //   let contract = await this.dashService.getServerContract(this.session()!)
  //
  //   this.client.set(client)
  //   this.contract.set(contract)
  //
  //   this.count++
  //   await this.getAllLocal()
  // }

  async notSessionFound() {
    // TODO: implemented
  }
}
