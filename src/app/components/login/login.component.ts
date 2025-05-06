import {Component, OnDestroy, signal} from '@angular/core';
import {adminVersion} from '../../core/utils/config';
import {LogIn} from '../../core/adapters/LogIn';
import {eAuthType} from '../../core/interfaces/oLogIn';
import {eLoginStatus} from '../../core/interfaces/oGlobal';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    MatProgressSpinner,
    MatButton,
    NgOptimizedImage,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatCard,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends LogIn implements OnDestroy {

  formLogin = signal(this.getForm)

  protected readonly eLoginStatus = eLoginStatus;
  protected readonly adminPlatform = adminVersion;

  constructor() {
    super()
  }

  ngOnDestroy(): void {
    this.formLogin().controls["password"].patchValue("")
  }

  async loginAction() {
    await this.login({
      username: this.formLogin().controls["username"].value,
      password: this.formLogin().controls["password"].value
    }, eAuthType.login)
  }
}
