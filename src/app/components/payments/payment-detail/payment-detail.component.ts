import {AfterViewInit, Component, EnvironmentInjector, inject, runInInjectionContext, signal} from '@angular/core';
import {SubToolbarComponent} from '../../../common/sub-toolbar/sub-toolbar.component';
import {IDCTxnRow} from '../../../core/utils/UtilDynamiCore';
import {ActivatedRoute, Router} from '@angular/router';
import {DynamicService} from '../../../core/services/dynamic.service';
import {MatCard} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {DashboardService} from '../../../core/services/dashboard.service';
import {oContract} from '../../../core/interfaces/oContract';
import {RouteData} from '../../../core/utils/globals';
import {oClient} from '../../../core/interfaces/oClient';
import {cContract, eProvider} from '../../../core/utils/UtilContract';
import {cClient} from '../../../core/utils/UtilClient';
import {UtilTime} from '../../../core/utils/UtilTime';
import {TitleCasePipe} from '@angular/common';
import {oConektaOrder} from '../../../core/interfaces/oConekta';

@Component({
  selector: 'app-payment-detail',
  imports: [
    SubToolbarComponent,
    MatCard,
    MatDivider,
    TitleCasePipe,
  ],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})
export class PaymentDetailComponent implements AfterViewInit {
  route = inject(ActivatedRoute)
  router = inject(Router)
  injector = inject(EnvironmentInjector)
  dashboardService = inject(DashboardService);

  id = signal("")
  externalId = signal("")
  paymentDynamic = signal<IDCTxnRow | null>(null)
  paymentConekta = signal<oConektaOrder | null>(null)
  contract = signal<oContract>(cContract)
  client = signal<oClient>(cClient)
  protected readonly eProvider = eProvider;

  constructor() {
    let _contract = this.dashboardService.GetDataFromRoute<oContract>(this.router, RouteData.CONTRACT)
    let _client = this.dashboardService.GetDataFromRoute<oClient>(this.router, RouteData.CLIENT)
    if (_contract?.financial.provider == eProvider.DynamiCore) {

      let _payment = this.dashboardService.GetDataFromRoute<IDCTxnRow>(this.router, RouteData.PAYMENT_DYNAMIC)
      this.init(_payment!, null, _client, _contract)

    } else if (_contract?.financial.provider == eProvider.Conekta) {

      let _payment = this.dashboardService.GetDataFromRoute<oConektaOrder>(this.router, RouteData.PAYMENT_CONEKTA)
      this.init(null, _payment!, _client, _contract)

    }
  }

  init(
    paymentDynamic: IDCTxnRow | null,
    paymentConekta: oConektaOrder | null,
    client: oClient | undefined,
    contract: oContract | undefined
  ) {
    if (paymentDynamic != undefined) this.paymentDynamic.set(paymentDynamic)

    if (paymentConekta != undefined) this.paymentConekta.set(paymentConekta)

    if (client != undefined && client.id != "") this.client.set(client)

    if (contract != undefined && contract?.id != "") this.contract.set(contract)
  }

  ngAfterViewInit(): void {
    const id = this.route.snapshot.params['id'];
    const externalId = this.route.snapshot.params['ext'];

    if (id != undefined) {
      this.id.set(id)
      this.externalId.set(externalId)
      this.GetPayment().then()
    }
  }

  async GetPayment() {
    await runInInjectionContext(this.injector, async () => {
      const service = inject(DynamicService)
      this.paymentDynamic.set(await service.getPayment(this.id(), this.externalId()))
    })
  }

  GetDateTimeDynamic(): string {
    if (this.paymentDynamic()?.created) return UtilTime.GetDateFromString(this.paymentDynamic()?.created!);
    return ""
  }

  GetDateTimeConekta(): string {
    if (this.paymentConekta()?.updated_at)
      return UtilTime.getLocalTimeFromLong(this.paymentConekta()?.updated_at!, eProvider.Conekta);
    return ""
  }

  GetNameOrder = (): string => {
    let name = this.paymentConekta()?.line_items!.data[0]!.name
    return name != undefined ? name : ""
  }

  GetServiceConekta = (): string => {
    let service = this.paymentConekta()?.charges.data[0].payment_method.service_name
    return service != undefined ? service : "";
  }
}
