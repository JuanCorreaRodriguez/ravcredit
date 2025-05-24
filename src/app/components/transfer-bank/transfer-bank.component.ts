import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
  signal
} from '@angular/core';
import {SubToolbarComponent} from '../../common/sub-toolbar/sub-toolbar.component';
import {MatCard} from '@angular/material/card';
import {oContract} from '../../core/interfaces/oContract';
import {cContract, FactoryContract} from '../../core/utils/UtilContract';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../core/services/dashboard.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IndexedDbService} from '../../core/indexed-db/indexed-db.service';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-transfer-bank',
  imports: [
    SubToolbarComponent,
    MatCard,
    TitleCasePipe,
  ],
  templateUrl: './transfer-bank.component.html',
  styleUrls: ['./transfer-bank.component.css', '../reference/reference.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferBankComponent implements AfterViewInit {
  injector = inject(EnvironmentInjector)
  route = inject(ActivatedRoute)
  contract = signal<oContract>(cContract)
  nextPayment = ""

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly idb: IndexedDbService
  ) {
    let id = this.route.snapshot.queryParams['id'];
    this.init(id).then()
  }

  async init(id: string) {
    let clientContract = await this.idb.GetClientContract(id)
    let _contract = FactoryContract.MapperTypeContCli_Contract(clientContract)
    this.contract.set(_contract)
    this.nextPayment = this.dashboardService.GetNextPayment(_contract)
  }

  ngAfterViewInit(): void {
    // console.log('ngAfterViewInit', this.contract().id);
  }

  copyClipboard(clabe: string) {
    runInInjectionContext(this.injector, () => {
      const clipboard = inject(Clipboard)
      const snack = inject(MatSnackBar)

      clipboard.copy(clabe)
      snack.open("CLABE copiada", "", {
        duration: 2000,
      })
    })
  }
}
