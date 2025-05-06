import {oAddress} from "./oAddress";
import {WritableSignal} from "@angular/core";
import {UntypedFormGroup} from "@angular/forms";

export interface iBusinessInfo {
  address: WritableSignal<oAddress>
  schedule: WritableSignal<oSchedule>
  businessData: WritableSignal<oBusinessInfo>

  updateBusinessData(data: oBusinessInfo): boolean

  getBusinessDataAPI(): oBusinessInfo

  getBusinessDataLocal(): oBusinessInfo

  initFormBusiness(): UntypedFormGroup
}

export interface oSchedule {
  day: string,
  open: number,
  close: number,
}

export type weekSchedule = {
  monday: {
    open?: string,
    close?: string
  },
  tuesday: {
    open?: string,
    close?: string
  },
  wednesday: {
    open?: string,
    close?: string
  },
  thursday: {
    open?: string,
    close?: string
  },
  friday: {
    open?: string,
    close?: string
  },
  saturday: {
    open?: string,
    close?: string
  },
  sunday: {
    open?: string,
    close?: string
  }
}

export interface oBusinessInfo {
  version: string,
  name: string
  desc?: string
  address: oAddress
  phones: string[]
  email: string
  schedule?: weekSchedule
}

export interface oBusinessDeadlines {
  weeks: number,
  interest: number
}

export interface oBusinessConfig {
  adminVersion: string,
  mobileVersion: string,
  mobileVersionPrev: string,
  apiVersion: string,
  deadlines: oBusinessDeadlines[]
  downloadsClient: boolean
  passportPaymentReference: boolean
  conektaPaymentReference: boolean
  conektaPaymentLink: boolean
  dynamicPaymentReference: boolean
  apkUrl: string
  version: string
}

export interface oTmpBusinessConfig {
  name?: string
  email?: string
  desc?: string
  street?: string
  neighbor?: string
  cp?: string
  ext?: string
  int?: string
  city?: string
  state?: string
  phones?: string[]
  mondayOpen?: string
  mondayClose?: string
  tuesdayOpen?: string
  tuesdayClose?: string
  wednesdayOpen?: string
  wednesdayClose?: string
  thursdayOpen?: string
  thursdayClose?: string
  fridayOpen?: string
  fridayClose?: string
  saturdayOpen?: string
  saturdayClose?: string
  sundayOpen?: string
  sundayClose?: string
}
