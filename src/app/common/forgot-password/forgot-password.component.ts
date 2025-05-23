import {Component, inject} from '@angular/core';
import {MatNavList} from '@angular/material/list';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-forgot-password',
  imports: [
    MatNavList
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email = "contacto@ravcredit.com"

  private _bottomSheetRef =
    inject<MatBottomSheetRef<ForgotPasswordComponent>>(MatBottomSheetRef)

}
