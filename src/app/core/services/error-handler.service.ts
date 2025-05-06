import { Injectable } from '@angular/core';
import {iSnackBarMessage, snackBarConfigAction, snackBarConfigNoAction} from '../interfaces/oGlobal';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private readonly _snackBar: MatSnackBar
  ) {
  }

  async httpError(error: any) {
    const data: iSnackBarMessage = {
      message: '',
      action: '',
      config: snackBarConfigAction
    }
    console.error(error)
    if (error.status == 0) {
      data.message = "Error en el servidor: API no disponible"
      data.action = "Entendido"
      data.config = snackBarConfigNoAction
    } else if (error.status == 404) {
      data.message = "Recurso no encontrado: verifica la información de tu petición"
      data.action = "Entendido"
      data.config = snackBarConfigNoAction
    } else if (error.status == 400) {
      data.message = "Error en la peticion: algo salió mal. Verifica el estado de la API"
      data.action = "Entendido"
      data.config = snackBarConfigNoAction
    } else {
      data.message = "Algo salió mal: Intentalo de nuevo más tarde"
      data.config = snackBarConfigNoAction
    }

    this.launchSnackbar(data)
  }

  launchSnackbar(data: iSnackBarMessage) {
    this._snackBar.open(data.message, data.action, data.config)
  }
}
