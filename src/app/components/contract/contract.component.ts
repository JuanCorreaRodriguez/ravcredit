import {
  Component,
  EnvironmentInjector,
  inject,
  input,
  Renderer2,
  RendererFactory2,
  runInInjectionContext
} from '@angular/core';
import {NgOptimizedImage, TitleCasePipe} from "@angular/common";
import {MatCard} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {oClient} from '../../core/interfaces/oClient';
import {oContract} from '../../core/interfaces/oContract';
import {oBusinessConfig, oBusinessInfo} from '../../core/interfaces/oBusiness';
import {MatDialog} from '@angular/material/dialog';
import {iInformativeDialog} from '../../core/interfaces/oGlobal';
import {InformativeDialogComponent} from '../../common/informative-dialog/informative-dialog.component';
import {IndexedDbService} from '../../core/indexed-db/indexed-db.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UtilTime} from '../../core/utils/UtilTime';

@Component({
  selector: 'app-contract',
  imports: [
    NgOptimizedImage,
    MatCard,
    MatDivider,
    MatIcon,
    TitleCasePipe
  ],
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css', '../dashboard/dashboard.component.css']
})
export class ContractComponent {
  client = input.required<oClient>();
  contract = input.required<oContract>()
  isMobile = input.required<boolean>();
  businessInfo = input.required<oBusinessInfo>()
  businessConfig = input.required<oBusinessConfig>()

  emailContact = "contact@ravcredit.com"
  phoneContact = "8135415648"

  injector = inject(EnvironmentInjector)
  rendererFactory = inject(RendererFactory2)
  renderer: Renderer2 | null = null;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null)
  }

  initSignOut() {
    runInInjectionContext(this.injector, () => {
      const _dialog = inject(MatDialog);

      const message: iInformativeDialog = {
        message: '¿Deseas cerrar tu sesión en Ravcredit?',
        title: 'Cerrar sesión',
        cancel: 'Cancelar',
        continue: 'Si, salir'
      }

      _dialog.open(InformativeDialogComponent, {
        data: message
      }).afterClosed().subscribe(result => {
        if (result) this.signOut()
      })

    })
  }

  async signOut() {
    await runInInjectionContext(this.injector, async () => {
      const idb = inject(IndexedDbService)
      await idb.deleteLocalDb()
      this.GoToSignIn()
    })
  }

  GoToSignIn() {
    runInInjectionContext(this.injector, () => {
      console.log("before goToSignIn")
      const route = inject(Router)
      route.navigate(["/sign-in"]).then()
    })
  }

  initDownload() {
    runInInjectionContext(this.injector, () => {

      let url = this.client().contractUrl
      let msg = ""
      const snack = inject(MatSnackBar)

      if (url == undefined) {
        msg = "No se encontró un contrato. Ponte en contacto con nosotros para verificar el estado de tu contrato"
      } else {
        msg = "Descargando contrato .pdf..."
        this.downloadPdf(url)
      }

      snack.open(msg, "", {duration: 2500})
    })
  }


  downloadPdf(path: string) {
    if (this.renderer == null) return

    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('type', `hidden`);
    link.href = path
    link.download = path
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  GetTotal = () => {
    let total = 0;

    let initial = this.contract().financial.initial ? this.contract().financial.initial : 0
    let deadlines = this.contract().financial.deadlines.weeks ? this.contract().financial.deadlines.weeks : 0
    let weekly = this.contract().financial.weeklyPayment ? this.contract().financial.weeklyPayment : 0

    return (weekly * deadlines) + initial
  }

  GetFormatedTime = (time: string) => UtilTime.GetTimeFromString(time)
}
