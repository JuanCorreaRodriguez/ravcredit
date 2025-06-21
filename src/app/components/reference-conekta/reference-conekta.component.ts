import {
  AfterViewInit,
  Component,
  EnvironmentInjector,
  inject,
  input,
  runInInjectionContext,
  signal
} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatButton} from '@angular/material/button';
import {cClient, FactoryClient} from '../../core/utils/UtilClient';
import {cContract, FactoryContract} from '../../core/utils/UtilContract';
import {DashboardService} from '../../core/services/dashboard.service';
import {IndexedDbService} from '../../core/indexed-db/indexed-db.service';
import {ActivatedRoute} from '@angular/router';
import {oContract} from '../../core/interfaces/oContract';
import {oClient} from '../../core/interfaces/oClient';
import {oConektaOrder} from '../../core/interfaces/oConekta';
import {TitleCasePipe} from '@angular/common';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {iInformativeDialog} from '../../core/interfaces/oGlobal';
import {InformativeDialogComponent} from '../../common/informative-dialog/informative-dialog.component';
import {ConektaService} from '../../core/services/conekta.service';

@Component({
  selector: 'app-reference-conekta',
  imports: [
    MatCard,
    MatDivider,
    MatButton,
    TitleCasePipe
  ],
  templateUrl: './reference-conekta.component.html',
  styleUrls: ['./reference-conekta.component.css', '../reference/reference.component.css']
})
export class ReferenceConektaComponent implements AfterViewInit {

  route = inject(ActivatedRoute)
  injector = inject(EnvironmentInjector)
  contract = signal<oContract>(cContract)
  client = signal<oClient>(cClient)
  generating = signal(false)
  id = input.required<string>();
  order = signal<oConektaOrder | null>(null)
  barcode = signal<string>("")
  nextPayment = ""

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly idb: IndexedDbService
  ) {
  }

  async ngAfterViewInit(): Promise<void> {
    let clientContract = await this.idb.GetClientContract(this.id())
    let _client = FactoryClient.MapperTypeContCli_Client(clientContract)
    let _contract = FactoryContract.MapperTypeContCli_Contract(clientContract)

    this.client.set(_client)
    this.contract.set(_contract)

    this.nextPayment = this.dashboardService.GetNextPayment(_contract)
    await this.getReference()
  }

  async getReference() {
    let ref = await this.dashboardService.GetOrderConekta(this.client().conekta_id!)
    if (!ref) return
    this.order.set(ref)
    if (ref.charges.data[0].payment_method.barcode_url != null)
      this.barcode.set(ref.charges.data[0].payment_method.barcode_url)
  }

  copyClipboard() {
    runInInjectionContext(this.injector, () => {
      const clipboard = inject(Clipboard)
      const snack = inject(MatSnackBar)

      clipboard.copy(this.client().reference!)
      snack.open("Referencia copiada", "", {
        duration: 2000,
      })
    })
  }

  initCreateReference() {
    runInInjectionContext(this.injector, () => {
      const service = inject(MatDialog)

      const message: iInformativeDialog = {
        message: '¿Deseas crear una nueva orden / referencia de pago?',
        title: '',
        cancel: 'Cancelar',
        continue: 'Continuar'
      }

      service.open(InformativeDialogComponent, {
        data: message
      }).afterClosed().subscribe(async result => {
        if (result) await this.createReference()
      })
    })
  }

  async createReference() {
    this.generating.set(true)

    await runInInjectionContext(this.injector, async () => {
      const service = inject(ConektaService)
      const snack = inject(MatSnackBar)

      snack.open("Generando referencia...", "", {
        duration: 5000,
      })

      const res =
        await service.initConektaCreateOrder(this.client(), this.contract())

      if (!this.generating()) return

      if (res != null) {
        this.client.set(res)
        // this.routing("/reference/dynamicore")
        await this.getReference()
        snack.open("Referencia generada!", "", {
          duration: 3000,
        })
      } else {
        snack.open("Algo salió mal al generar la referencia, por favor, intentalo de nuevo más tarde, si el problema continua, contactanos.", "", {
          duration: 5000,
        })
      }
      console.log("createeRRef")
      this.generating.set(false)
    })
  }
}
