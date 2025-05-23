import {EnvironmentInjector, inject, runInInjectionContext, signal, WritableSignal} from "@angular/core";
import {eAuthType, iLogIn, oAuth} from "../interfaces/oLogIn";
import {FormBuilder, UntypedFormGroup} from "@angular/forms";
import {groupLogIn} from "../utils/constLogIn";
import {eLoginStatus, snackBarConfigNoAction} from "../interfaces/oGlobal";
import {MatSnackBar} from "@angular/material/snack-bar";
import {toObservable} from "@angular/core/rxjs-interop";
import {cIncorrectPassword, cNotUserFound} from "../utils/messages";
import {LoginService} from '../services/login.service';
import {NavService} from '../services/nav.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ForgotPasswordComponent} from '../../common/forgot-password/forgot-password.component';

export class LogIn implements iLogIn {
  password: WritableSignal<string> = signal("");
  username: WritableSignal<string> = signal("");
  hide = signal(true);
  authType = signal<eAuthType>(eAuthType.idle)
  authorized = signal(false)
  _snackBar = inject(MatSnackBar)
  private logInService: LoginService = inject(LoginService)
  logInStatus = this.logInService.status
  private _fb: FormBuilder = inject(FormBuilder)
  private _form: UntypedFormGroup = this._fb.group(groupLogIn)
  private nav: NavService = inject(NavService)
  private injector = inject(EnvironmentInjector)

  constructor() {
    toObservable(this.logInStatus).subscribe(async (e) => {
      if (e == eLoginStatus.NOAUTHORIZED || e == eLoginStatus.NOTFOUND) this.notificator(cNotUserFound)
      if (e == eLoginStatus.ERRORPASSWORD) this.notificator(cIncorrectPassword)
      if (e == eLoginStatus.AUTHORIZED) {
        if (this.authType() === eAuthType.login) {
          await this.success()
          return
        }
        this.logInService.status.set(eLoginStatus.IDLE)
        this.authorized.set(true)
      }
    })
  }

  get getForm(): UntypedFormGroup {
    return this._form;
  }

  forgotPassword(): void {
    runInInjectionContext(this.injector, () => {
      let const_bottomSheet = inject(MatBottomSheet)

      const_bottomSheet.open(ForgotPasswordComponent, {
        disableClose: false,
        hasBackdrop: true,
        closeOnNavigation: true,
      })
    })
  }

  async login(credentials: oAuth, destination: eAuthType) {
    this.authType.set(destination)
    await this.logInService.initLogin(credentials)
  }

  async success() {
    this.nav.routing("dashboard")
  }

  clickEvent(event: MouseEvent) {
    event.stopPropagation();
    this.hide.set(!this.hide());
  }

  notificator(msg: string) {
    this._snackBar.open(msg, "", snackBarConfigNoAction);
  }
}
