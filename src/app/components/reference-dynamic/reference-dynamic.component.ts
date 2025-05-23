import {AfterViewInit, Component, EnvironmentInjector, inject, runInInjectionContext, signal} from '@angular/core';
import {SubToolbarComponent} from '../../common/sub-toolbar/sub-toolbar.component';
import {MatCard} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatButton} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {oContract} from '../../core/interfaces/oContract';
import {cContract, FactoryContract} from '../../core/utils/UtilContract';
import {oClient} from '../../core/interfaces/oClient';
import {cClient, FactoryClient} from '../../core/utils/UtilClient';
import {DashboardService} from '../../core/services/dashboard.service';
import {RoutingParams} from '../../core/utils/globals';
import {DynamicService} from '../../core/services/dynamic.service';
import {cIDCGeneratedReference, IDCGeneratedReference} from '../../core/utils/UtilDynamiCore';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {InformativeDialogComponent} from '../../common/informative-dialog/informative-dialog.component';
import {iInformativeDialog} from '../../core/interfaces/oGlobal';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {IndexedDbService} from '../../core/indexed-db/indexed-db.service';

@Component({
  selector: 'app-reference-dynamic',
  imports: [
    SubToolbarComponent,
    MatCard,
    MatDivider,
    MatButton,
    MatProgressSpinner,
  ],
  templateUrl: './reference-dynamic.component.html',
  styleUrls: ['./reference-dynamic.component.css', '../reference/reference.component.css']
})
export class ReferenceDynamicComponent implements AfterViewInit {
  route = inject(ActivatedRoute)
  injector = inject(EnvironmentInjector)
  dynamicService = inject(DynamicService)
  contract = signal<oContract>(cContract)
  client = signal<oClient>(cClient)
  generating = signal(false)
  nextPayment = ""
  reference = signal<IDCGeneratedReference>(cIDCGeneratedReference)

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly idb: IndexedDbService
  ) {
    // let _contract = this.dashboardService.GetDataFromRoute<oContract>(this.router, RouteData.CONTRACT)
    // let _client = this.dashboardService.GetDataFromRoute<oClient>(this.router, RouteData.CLIENT)
    let id = this.route.snapshot.queryParams['id'];

    this.init(id).then()
  }

  async init(id: string) {
    let clientContract = await this.idb.GetClientContract(id)
    let _client = FactoryClient.MapperTypeContCli_Client(clientContract)
    let _contract = FactoryContract.MapperTypeContCli_Contract(clientContract)
    this.client.set(_client)
    this.contract.set(_contract)
    this.nextPayment = this.dashboardService.GetNextPayment(_contract)
    await this.getReference()
  }

  async getReference() {
    let ref = await this.dashboardService.GetReferenceDynamic(this.client().reference!)
    this.reference.set(ref!)
  }

  async ngAfterViewInit() {
    // await this.LoadReference()
  }

  async LoadReference() {
    let ref = await this.dynamicService.getReference(String(this.client().reference))
    if (ref != null) this.reference.set(ref)
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
        message: '¿Deseas crear una nueva referencia de pago?',
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
      const service = inject(DynamicService)
      const snack = inject(MatSnackBar)
      const res = await service.initDynamicCreateReference(this.client(), this.contract())

      if (!this.generating()) return

      if (res != null) {
        this.client.set(res)
        // this.routing("/reference/dynamicore")
        await this.LoadReference()
        snack.open("Referencia generada!", "", {
          duration: 3000,
        })
      } else {
        snack.open("Algo salió mal al generar la referencia, por favor, intentalo de nuevo más tarde, si el problema continua, contactanos.", "", {
          duration: 5000,
        })
      }

      this.generating.set(false)
    })
  }

  routing(route: string) {
    runInInjectionContext(this.injector, () => {
      const router = inject(Router);
      const routeParams: RoutingParams = {
        client: this.client(),
        contract: this.contract(),
      }
      router.navigate([route], {
        state: routeParams
      })
    })

  }
}
