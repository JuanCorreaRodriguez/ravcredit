import {
  AfterViewInit,
  Component,
  EnvironmentInjector,
  inject,
  input,
  OnDestroy,
  runInInjectionContext,
  signal
} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {oClient} from '../../core/interfaces/oClient';
import {oContract} from '../../core/interfaces/oContract';
import {MatCard} from '@angular/material/card';
import {eProvider} from '../../core/utils/UtilContract';
import {DynamicService} from '../../core/services/dynamic.service';
import {IDCTxnRow} from '../../core/utils/UtilDynamiCore';
import {Router} from '@angular/router';
import {RoutingParams} from '../../core/utils/globals';
import {UtilTime} from '../../core/utils/UtilTime';
import {TitleCasePipe} from '@angular/common';
import {ConektaService} from '../../core/services/conekta.service';
import {oConektaOrder} from '../../core/interfaces/oConekta';
import {Subscription} from 'rxjs';
import {ObservablesService} from '../../core/services/observables.service';

@Component({
  selector: 'app-payments',
  imports: [
    MatIcon,
    MatCard,
    TitleCasePipe
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css', '../dashboard/dashboard.component.css']
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
  client = input.required<oClient>();
  contract = input.required<oContract>()
  paymentsDynamic = signal<IDCTxnRow[]>([])
  observables = inject(ObservablesService)

  paymentsConekta = signal<oConektaOrder[]>([])
  toggleEmptyScreen = false
  injector = inject(EnvironmentInjector)
  paymentsLoaded = new Subscription()
  protected readonly eProvider = eProvider;

  ngAfterViewInit(): void {
    switch (this.contract().financial.provider) {
      case eProvider.DynamiCore:
        if (this.client().dynamic_account)
          this.LoadDynamicPayments(Number(this.client().dynamic_account)).then()
        break
      case eProvider.Conekta:
        if (this.client().conekta_id != undefined) {
          this.LoadConektaPayments(this.client().conekta_id!).then()
        }
        break
      case eProvider.Passport:
        // this.LoadPassportPayments()
        break
    }

    this.paymentsLoaded = this.observables.ConektaOrdersLoaded.subscribe((e) => {
      if (e) this.LoadConektaPayments(this.client().conekta_id!).then()
    })
  }

  ngOnDestroy(): void {
    this.paymentsLoaded.unsubscribe()
  }

  async LoadDynamicPayments(account: number) {
    await runInInjectionContext(this.injector, async () => {
      const service = inject(DynamicService)
      const _payments = await service.getPayments(account)
      this.paymentsDynamic.set(_payments)
    })
  }

  async LoadConektaPayments(account: string) {
    await runInInjectionContext(this.injector, async () => {
      const service = inject(ConektaService)
      const _payments = await service.getPaymentLocal(account)
      this.paymentsConekta.set(_payments)
    })
  }

  LoadPassportPayments() {

  }

  async GoDetails(transaction: IDCTxnRow) {
    await runInInjectionContext(this.injector, async () => {
      const router = inject(Router)
      const parms: RoutingParams = {
        contract: this.contract(),
        client: this.client(),
        paymentDynamic: transaction
      }
      await router.navigate(['payment-detail'], {
        state: parms
      })
    })
    // if (external) this.router.navigate([`/payment/${path}/${external}`]);
  }

  async GoDetailsConekta(transaction: oConektaOrder) {
    await runInInjectionContext(this.injector, async () => {
      const router = inject(Router)
      const parms: RoutingParams = {
        contract: this.contract(),
        client: this.client(),
        orderConekta: transaction
      }
      await router.navigate(['payment-detail'], {
        state: parms
      })
    })
    // if (external) this.router.navigate([`/payment/${path}/${external}`]);
  }

  GetDateTime = (date: string) => UtilTime.GetDateFromString(date)

  GetDateTimeLong = (date: number, provider: string) =>
    UtilTime.getLocalTimeFromLong(date, provider)
}
