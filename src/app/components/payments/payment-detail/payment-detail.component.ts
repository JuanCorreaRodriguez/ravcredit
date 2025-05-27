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
import {cContract} from '../../../core/utils/UtilContract';
import {cClient} from '../../../core/utils/UtilClient';
import {UtilTime} from '../../../core/utils/UtilTime';
import {TitleCasePipe} from '@angular/common';

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
  payment = signal<IDCTxnRow | null>(null)
  contract = signal<oContract>(cContract)
  client = signal<oClient>(cClient)

  constructor() {
    let _contract = this.dashboardService.GetDataFromRoute<oContract>(this.router, RouteData.CONTRACT)
    let _client = this.dashboardService.GetDataFromRoute<oClient>(this.router, RouteData.CLIENT)
    let _payment = this.dashboardService.GetDataFromRoute<IDCTxnRow>(this.router, RouteData.PAYMENT_DYNAMIC)
    this.init(_payment, _client, _contract)
  }

  init(payment: IDCTxnRow | undefined, client: oClient | undefined, contract: oContract | undefined) {
    if (payment != undefined) this.payment.set(payment)

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
      this.payment.set(await service.getPayment(this.id(), this.externalId()))
    })
  }

  GetDateTime(): string {
    if (this.payment()?.created) return UtilTime.GetDateFromString(this.payment()?.created!);
    return ""
  }
}
