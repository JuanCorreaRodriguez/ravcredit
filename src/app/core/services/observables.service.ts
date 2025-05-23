import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {
  constructor() {
  }

  private _DynamicPaymentLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get DynamicPaymentLoaded(): BehaviorSubject<boolean> {
    return this._DynamicPaymentLoaded;
  }

  set DynamicPaymentLoaded(value: BehaviorSubject<boolean>) {
    this._DynamicPaymentLoaded = value;
  }

  // private _syncDashboard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // get syncDashboard(): BehaviorSubject<boolean> {
  //   return this._syncDashboard;
  // }

  private _logOut: BehaviorSubject<any> = new BehaviorSubject(false)

  get logOut(): BehaviorSubject<any> {
    return this._logOut;
  }

  set logOut(value: BehaviorSubject<any>) {
    this._logOut = value;
  }

  private _isLate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLate(): BehaviorSubject<boolean> {
    return this._isLate;
  }

  set isLate(value: BehaviorSubject<boolean>) {
    this._isLate = value;
  }
}
