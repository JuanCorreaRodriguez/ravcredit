import {
  AfterViewInit,
  Component,
  EnvironmentInjector,
  inject,
  input,
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
export class PaymentComponent implements AfterViewInit {
  client = input.required<oClient>();
  contract = input.required<oContract>()
  paymentsDynamic = signal<IDCTxnRow[]>([])
  toggleEmptyScreen = false
  injector = inject(EnvironmentInjector)

  ngAfterViewInit(): void {

    switch (this.contract().financial.provider) {
      case eProvider.DynamiCore:
        if (this.client().dynamic_account)
          this.LoadDynamicPayments(Number(this.client().dynamic_account)).then()
        break
      case eProvider.Conekta:
        // this.LoadConektaPayments()
        break
      case eProvider.Passport:
        // this.LoadPassportPayments()
        break
    }
  }

  async LoadDynamicPayments(account: number) {
    await runInInjectionContext(this.injector, async () => {
      const service = inject(DynamicService)
      const _payments = await service.getPayments(account)
      this.paymentsDynamic.set(_payments)
    })
  }

  LoadConektaPayments() {

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

  GetDateTime = (date: string) => UtilTime.GetDateFromString(date)
}
