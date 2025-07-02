import {add, format, getDate} from "date-fns";
import {es} from 'date-fns/locale/es';
import {oPaymentDates} from "../interfaces/oGlobal";
import {eProvider} from './UtilContract';
import {dateCompleteFormat, dateFormat, expiredPayment, timeFormat} from './config';
import {inject, Injector, runInInjectionContext} from '@angular/core';
import {IndexedDbService} from '../indexed-db/indexed-db.service';
import {ObservablesService} from '../services/observables.service';
import {IDCTxnRow} from './UtilDynamiCore';
import {oConektaOrder} from '../interfaces/oConekta';


export class UtilTime {
  private localeFns = es

  public static IsExpired(time: number): boolean {
    const dateInit = new Date(time)
    const dayInit = dateInit.getDate()
    const monthInit = dateInit.getMonth() + 1

    const dateActual = new Date()
    const dayActual = dateActual.getDate()
    const monthActual = dateActual.getMonth() + 1

    if (monthActual > monthInit) return true

    return dayActual > dayInit;
  }

  public static getDates(initial: number, weeks: number): oPaymentDates[] {
    const dates: oPaymentDates[] = []
    let prev = initial
    for (let i = 0; i < weeks; i++) {
      const date = add(prev, {weeks: 1})
      dates.push(
        {
          week: i + 1,
          date: date.getTime()
        }
      )
      prev = date.getTime()
    }
    return dates
  }

  public static getPreviousWeek() {
    const today = new Date().getTime()
    const week = ((3600 * 24) * 7) * 1000
    return today - week
  }

  public static getDayNum(date: Date | number): number {
    return getDate(date)
  }

  public static getDayName(date: Date | number): string {
    return format(date, "EEEE", {locale: es})
  }

  public static getMonthName(date: Date | number): string {
    return format(date, "MMMM", {locale: es}).toUpperCase();
  }

  public static getYear(date: Date | number): string {
    return format(date, "yyyy")
  }

  public static GetNextPayment(time: number, provider: string) {
    let week = 0
    if (provider == eProvider.Conekta) {
      week = (((3600 * 24) * 7))
    } else if (provider == eProvider.DynamiCore) {
      week = (((3600 * 24) * 7) * 1000)
    }
    return this.getLocalTimeFromLong(time + week, provider)
  }

  public static getLocalTimeFromLong(time: number, provider: string) {
    if (time <= 0) return ""
    let factor = this.GetFactor(provider)
    let dateTime = time * factor
    let parsedDate = format(new Date(dateTime), dateFormat, {
      locale: es
    })
    return parsedDate
  }

  public static DelayPaymentLast(
    lastPayment: number, provider: string, injector: Injector
  ): boolean {
    let factor = this.GetFactor(provider)
    let now = new Date().getTime()
    let last = 0

    if (provider == eProvider.Conekta)
      last = ((((3600 * 24) * 7)) + lastPayment) * factor
    else if (provider == eProvider.DynamiCore)
      last = ((((3600 * 24) * 7) * 1000) + lastPayment) * factor

    runInInjectionContext(injector, () => {
      const idb = inject(IndexedDbService)
      const observable = inject(ObservablesService)
      idb.setLocalStorage(expiredPayment, String(now > last))
      observable.isLate.next(now > last)
    })
    // 1751091565767
    // 1751557440
    return now > last
  }

  public static GetFactor(provider: string) {
    let factor = 1
    if (provider == eProvider.Conekta)
      factor = 1000
    return factor
  }

  public static GetEpochFromFormatedDate(date: string): number {
    if (date == "") return 0

    const _date = new Date(date)
    if (isNaN(_date.getTime())) return 0
    return _date.getTime()
  }

  public static GetTimeFromString(date: string) {
    return format(new Date(date), timeFormat, {
      locale: es
    })
  }

  public static GetDateFromString(date: string) {
    return format(new Date(date), dateCompleteFormat, {
      locale: es
    })
  }

  // Quick sort
  public static SortingByTime(payments: IDCTxnRow[]): IDCTxnRow[] {
    if (payments.length <= 1) return payments

    const pivot = payments[payments.length - 1]
    const pivotDate = new Date(pivot.created).getTime()
    const left: IDCTxnRow[] = []
    const right: IDCTxnRow[] = []

    for (let i = 0; i < payments.length - 1; i++) {
      const actualDate = new Date(payments[i].created).getTime()
      if (actualDate > pivotDate) left.push(payments[i])
      else right.push(payments[i])
    }

    return [...this.SortingByTime(left), pivot, ...this.SortingByTime(right)]
  }

  public static SortingByTimeConekta(payments: oConektaOrder []): oConektaOrder[] {
    if (payments.length <= 1) return payments;

    const pivot = payments[payments.length - 1]
    let pivotDate = 0;
    if (pivot.charges.data == undefined) return payments

    if (pivot.charges.data[0].paid_at != undefined) {
      pivotDate = pivot.charges.data[0].paid_at
    } else {
      pivot.charges.data[0].created_at
    }

    if (pivotDate <= 0) return payments;

    const left: oConektaOrder[] = []
    const right: oConektaOrder [] = []

    for (let i = 0; i < payments.length - 1; i++) {
      const actual = payments[i].charges.data[0].paid_at;
      if (actual <= 0) continue
      if (actual > pivotDate) left.push(payments[i])
      else right.push(payments[i])
    }

    return [...this.SortingByTimeConekta(left), pivot, ...this.SortingByTimeConekta(right)]
  }
}
