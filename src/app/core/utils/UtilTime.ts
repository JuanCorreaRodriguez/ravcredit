import {add, format, getDate} from "date-fns";
import {es} from 'date-fns/locale/es';
import {oPaymentDates} from "../interfaces/oGlobal";


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
}
