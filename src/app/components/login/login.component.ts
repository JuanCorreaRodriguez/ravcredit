import {Component, OnDestroy, signal} from '@angular/core';
import {webAppVersion} from '../../core/utils/config';
import {LogIn} from '../../core/adapters/LogIn';
import {eAuthType} from '../../core/interfaces/oLogIn';
import {eLoginStatus} from '../../core/interfaces/oGlobal';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  imports: [
    NgOptimizedImage, MatLabel, MatCard, FormsModule, MatFormFieldModule, MatInput, MatIcon, MatIconButton, MatButton, ReactiveFormsModule, MatProgressSpinner
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends LogIn implements OnDestroy {

  formLogin = signal(this.getForm)

  protected readonly eLoginStatus = eLoginStatus;
  protected readonly adminPlatform = webAppVersion;

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

// jose-juan.correa@outlook.com
