import {
  oBusinessConfig,
  oBusinessDeadlines,
  oBusinessInfo,
  oSchedule,
  oTmpBusinessConfig,
  weekSchedule
} from "../interfaces/oBusiness";
import {UntypedFormArray, UntypedFormControl, Validators} from "@angular/forms";
import {cAddress} from "./UtilContract";
import {oAddress} from "../interfaces/oAddress";


export const cSchedule: oSchedule = {
  day: "",
  open: 0,
  close: 0,
}

export const cEmptyDay: oSchedule = {
  close: 0, open: 0, day: ""
}

export const week: string[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
]

export const cDefinedSchedule: oSchedule[] = [
  {close: 0, open: 0, day: "monday"},
  {close: 0, open: 0, day: "tuesday"},
  {close: 0, open: 0, day: "wednesday"},
  {close: 0, open: 0, day: "thursday"},
  {close: 0, open: 0, day: "friday"},
  {close: 0, open: 0, day: "saturday"},
  {close: 0, open: 0, day: "sunday"},
]

export const cBusinessInfo: oBusinessInfo = {
  version: "v2024",
  name: "",
  address: cAddress,
  phones: [],
  email: "",
}
export const cBusinessDeadlines: oBusinessDeadlines = {
  weeks: 0,
  interest: 0
}

export const cBusinessConfig: oBusinessConfig = {
  version: "",
  apiVersion: "",
  adminVersion: "",
  mobileVersion: "",
  mobileVersionPrev: "",
  deadlines: [],
  downloadsClient: false,
  passportPaymentReference: false,
  conektaPaymentReference: false,
  conektaPaymentLink: false,
  dynamicPaymentReference: false,
  apkUrl: "https://firebasestorage.googleapis.com/v0/b/ravcredit-2b079.appspot.com/o/mobile-app%2Fapp-release.apk?alt=media&token=ae05f332-a39a-46ad-8a64-312ae1487496"
}


export class FactoryBusiness {

  public static FormBusinessInfo(info?: oBusinessInfo) {
    let data = cBusinessInfo

    if (info) data = info

    if (!info?.address) data.address = cAddress

    return {
      name: new UntypedFormControl(data.name, Validators.required),
      email: new UntypedFormControl(data.email, [Validators.required, Validators.email]),
      desc: new UntypedFormControl(data.desc, [Validators.required, Validators.email]),
      street: new UntypedFormControl(data.address.street, Validators.required),
      neighbor: new UntypedFormControl(data.address.neighbor, Validators.required),
      cp: new UntypedFormControl(data.address.zip, Validators.required),
      ext: new UntypedFormControl(data.address.ext, Validators.required),
      int: new UntypedFormControl(data.address.int),
      city: new UntypedFormControl(data.address.city, Validators.required),
      state: new UntypedFormControl(data.address.state, Validators.required),
      phones: new UntypedFormControl(data.phones),
      mondayOpen: new UntypedFormControl(data.schedule?.monday.open),
      mondayClose: new UntypedFormControl(data.schedule?.monday.close),
      tuesdayOpen: new UntypedFormControl(data.schedule?.tuesday.open),
      tuesdayClose: new UntypedFormControl(data.schedule?.tuesday.close),
      wednesdayOpen: new UntypedFormControl(data.schedule?.wednesday.open),
      wednesdayClose: new UntypedFormControl(data.schedule?.wednesday.close),
      thursdayOpen: new UntypedFormControl(data.schedule?.thursday.open),
      thursdayClose: new UntypedFormControl(data.schedule?.thursday.close),
      fridayOpen: new UntypedFormControl(data.schedule?.friday.open),
      fridayClose: new UntypedFormControl(data.schedule?.friday.close),
      saturdayOpen: new UntypedFormControl(data.schedule?.saturday.open),
      saturdayClose: new UntypedFormControl(data.schedule?.saturday.close),
      sundayOpen: new UntypedFormControl(data.schedule?.sunday.open),
      sundayClose: new UntypedFormControl(data.schedule?.sunday.close),
    }

  }

  public static CreateBusinessInfoObj(data: oTmpBusinessConfig) {
    const address: oAddress = cAddress
    const schedule: weekSchedule = {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {}
    }

    if (data.street) address.street = data.street
    if (data.state) address.state = data.state
    if (data.neighbor) address.neighbor = data.neighbor
    if (data.city) address.city = data.city
    if (data.ext) address.ext = data.ext
    if (data.int) address.int = data.int
    if (data.cp) address.zip = data.cp

    if (data.mondayOpen) schedule.monday.open = data.mondayOpen
    if (data.mondayClose) schedule.monday.close = data.mondayClose

    if (data.tuesdayOpen) schedule.tuesday.open = data.tuesdayOpen
    if (data.tuesdayClose) schedule.tuesday.close = data.tuesdayClose

    if (data.wednesdayOpen) schedule.wednesday.open = data.wednesdayOpen
    if (data.wednesdayClose) schedule.wednesday.close = data.wednesdayClose

    if (data.thursdayOpen) schedule.thursday.open = data.thursdayOpen
    if (data.thursdayClose) schedule.thursday.close = data.thursdayClose

    if (data.fridayOpen) schedule.friday.open = data.fridayOpen
    if (data.fridayClose) schedule.friday.close = data.fridayClose

    if (data.saturdayOpen) schedule.saturday.open = data.saturdayOpen
    if (data.saturdayClose) schedule.saturday.close = data.saturdayClose

    if (data.sundayOpen) schedule.sunday.open = data.sundayOpen
    if (data.sundayClose) schedule.sunday.close = data.sundayClose

    const info: oBusinessInfo = {
      version: "v2024",
      name: data.name ? data.name : "",
      address: address,
      phones: data.phones ? data.phones : [],
      email: data.email ? data.email : "",
      schedule: schedule,
      desc: data.desc ? data.desc : ""
    }

    return info
  }

  public static FormDeadlineConfig(data: oBusinessDeadlines) {
    // if (!data) data = cBusinessDeadlines

    return {
      weeks: new UntypedFormControl(data.weeks),
      interest: new UntypedFormControl(data.interest),
    }
  }


  public static FormBusinessConfig(config?: oBusinessConfig) {
    let data = cBusinessConfig
    if (config) data = config

    return {
      downloadsClient: new UntypedFormControl(data.downloadsClient),
      passportPaymentReference: new UntypedFormControl(data.passportPaymentReference),
      conektaPaymentReference: new UntypedFormControl(data.conektaPaymentReference),
      conektaPaymentLink: new UntypedFormControl(data.conektaPaymentLink),
      dynamicPaymentReference: new UntypedFormControl(data.dynamicPaymentReference),
      deadlines: new UntypedFormArray([])
    }
  }
}
