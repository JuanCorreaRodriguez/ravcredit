import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {iInformativeDialog} from '../../core/interfaces/oGlobal';

@Component({
  selector: 'app-informative-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ],
  templateUrl: './informative-dialog.component.html',
  styleUrl: './informative-dialog.component.css'
})
export class InformativeDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: iInformativeDialog,
    public dialogRef: MatDialogRef<InformativeDialogComponent>
  ) {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  continue() {
    this.dialogRef.close(true)
  }

}
