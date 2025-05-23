import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  runInInjectionContext,
  signal
} from '@angular/core';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {HomeComponent} from '../home/home.component';
import {LoaderComponent} from '../loader/loader.component';
import {MatIcon} from '@angular/material/icon';
import {NotificationsComponent} from '../notifications/notifications.component';
import {ContractComponent} from '../contract/contract.component';
import {ReferenceComponent} from '../reference/reference.component';
import {PaymentComponent} from '../payments/payment.component';
import {iInformativeDialog, snackBarConfigNoAction} from '../../core/interfaces/oGlobal';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {InformativeDialogComponent} from '../../common/informative-dialog/informative-dialog.component';
import {Dashboard} from '../../core/adapters/Dashboard';
import {Subscription} from 'rxjs';
import {ObservablesService} from '../../core/services/observables.service';
import {NavService} from '../../core/services/nav.service';
import {MatFabButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgClass, TitleCasePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {eProvider} from '../../core/utils/UtilContract';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatTabGroup,
    MatTab,
    HomeComponent,
    LoaderComponent,
    MatTabLabel,
    MatIcon,
    NotificationsComponent,
    ContractComponent,
    ReferenceComponent,
    PaymentComponent,
    MatFabButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgClass,
    TitleCasePipe,
    MatDivider,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends Dashboard implements OnInit, AfterViewInit {
  isMobile: boolean = false;
  showFiller = false;
  _dialog = inject(MatDialog)
  _snack = inject(MatSnackBar)
  observables = inject(ObservablesService)
  toolbarSubs = new Subscription()
  logOutSubs = new Subscription()
  router = inject(Router)
  route = inject(ActivatedRoute)
  selectedTabIndex = 0
  screenWidth: number;
  menuOpen = signal(false)

  constructor() {
    super();
    this.screenWidth = 0
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.getScreenWidth()
  }

  async ngOnInit(): Promise<void> {

    this.route.fragment.subscribe(fragment => {
      this.setTabFromFragment(fragment);
    });

    this.localSession()

    if (!this.session()) {
      await this.notSessionFound()
      return
    }

    await this.getGlobalData()
    await this.checkProvider()
  }

  setTabFromFragment(fragment: string | null) {
    switch (fragment) {
      case 'home':
        this.selectedTabIndex = 0;
        break;
      case 'payments':
        this.selectedTabIndex = 1;
        break;
      case 'reference':
        this.selectedTabIndex = 2;
        break;
      case 'notifications':
        this.selectedTabIndex = 3;
        break;
      case 'contract':
        this.selectedTabIndex = 4;
        break;
      default:
        this.selectedTabIndex = 0;
    }
    // this.router.navigate([`dashboard#${fragment}`]);
  }

  async ngAfterViewInit(): Promise<void> {
    this.getScreenWidth()

    // this.toolbarSubs = this.observables.syncDashboard.subscribe({
    //   next: data => {
    //     if (data) this.sync()
    //   }
    // })

    this.logOutSubs = this.observables.logOut.subscribe({
      next: data => {
        if (data) {
          this.signOut()
          this.observables.logOut.next(false)
        }
      }
    })

    this.observables.DynamicPaymentLoaded.subscribe((e) => {
      if (e && this.contract().financial.provider == eProvider.DynamiCore) {
        this.checkProvider()
        this.observables.DynamicPaymentLoaded.next(false)
      }
    })
  }

  async signOut() {
    const message: iInformativeDialog = {
      message: '¿Deseas cerrar tu sesión?',
      title: 'Cerrar sesión',
      cancel: 'Cancelar',
      continue: 'Salir'
    }

    this._dialog.open(InformativeDialogComponent, {
      data: message,
    }).afterClosed().subscribe(async (e) => {
      if (e) await this.closeSession()
    });

  }

  async closeSession() {
    await this.signOutApp()
    runInInjectionContext(this.injector, () => {
      let nav = inject(NavService)
      nav.routing("sign-in")
    })
  }

  async sync() {
    this._snack.open("Actualizando...", "", snackBarConfigNoAction)
    await this.getAllServer()
    this._snack.open("Info actualizada", "", snackBarConfigNoAction)
    // this.observables.syncDashboard.next(false)
  }

  changeMenu = () => this.menuOpen.set(!this.menuOpen())

  onTabChange(index: number) {
    let fragment = '';
    switch (index) {
      case 0:
        fragment = 'home';
        break;
      case 1:
        fragment = 'payments';
        break;
      case 2:
        fragment = 'reference';
        break;
      case 3:
        fragment = 'notifications';
        break;
      case 4:
        fragment = 'contract';
        break;
    }
    this.router.navigate([], {fragment});
  }

  setTabChange = (i: number) => this.selectedTabIndex = i

  private getScreenWidth() {
    this.screenWidth = window.innerWidth;
  }
}
