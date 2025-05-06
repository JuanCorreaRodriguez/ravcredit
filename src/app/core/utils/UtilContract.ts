import {UntypedFormArray, UntypedFormControl, Validators} from "@angular/forms";
import {oDevice} from "../interfaces/oDevice";
import {oFinancial} from "../interfaces/oFinancial";
import {oClient, oUserReference} from "../interfaces/oClient";
import {oAddress} from "../interfaces/oAddress";
import {oContract} from "../interfaces/oContract";
import {cClient, cUserReference} from "./UtilClient";
import {TaskState} from "firebase/storage";
import {cBusinessDeadlines} from "./UtilBusiness";
import {tyClientContract} from "../interfaces/oGlobal";
import {IDCAccount} from "./UtilDynamiCore";

export enum eProvider {
  none = "",
  Conekta = "Conekta",
  Passport = "Passport",
  DynamiCore = "DynamiCore",
}

export type ProgressTaskStatus = TaskState | "uploading" | "idle" | "generating" | "unauthorized"

export const cDevice: oDevice = {
  device: "",
  IMEI: ""
}

export const cFinancial: oFinancial = {
  total: 0,
  initial: 0,
  deadlines: cBusinessDeadlines,
  initDate: 0,
  weeklyPayment: 0,
  pendingOf: [],
  progress: [],
  interest: 0,
  provider: eProvider.DynamiCore,
  financed: 0,
  nextPayment: 0,
  amount_commission_opening: 0,
  principal_disbursed: 0,
  expected_disbursed: 0, // ---------
  credit_type: 'Arrendamiento',
  interest_rate: 0,
  commission_opening: 0,
  interest_arrears: 0,
}

export const cAddress: oAddress = {
  street: "",
  city: "",
  neighbor: "",
  zip: "",
  ext: "",
  int: "",
  state: ""
}

export const cContract: oContract = {
  id: "",
  client: "",
  address: cAddress,
  device: cDevice,
  financial: cFinancial,
  by: "",
  active: true
}

export class FactoryContract {

  public static FormClient(client?: oClient) {
    let data = cClient

    if (client) data = client

    return {
      name: new UntypedFormControl(data.name, [Validators.required, Validators.minLength(10)]),
      email: new UntypedFormControl(data.username, [Validators.required, Validators.email]),
      phone: new UntypedFormControl(data.phone, [Validators.required, Validators.min(10)]),
      curp: new UntypedFormControl(data.curp, [Validators.required, Validators.minLength(16)]),
      userReferences: new UntypedFormArray([])
    }
  }

  public static CreateUserReferenceFormObj(user: oUserReference) {
    let data = cUserReference

    if (user.name != "") data = user

    return {
      name: new UntypedFormControl(data.name, [Validators.required, Validators.minLength(10)]),
      phone: new UntypedFormControl(data.phone, [Validators.required]),
      relationship: new UntypedFormControl(data.relationship, [Validators.required]),
    }
  }

  public static FormAddress(address?: oAddress) {
    let data = cAddress

    if (address) data = address

    return {
      street: new UntypedFormControl(data.street, Validators.required),
      neighbor: new UntypedFormControl(data.neighbor, Validators.required),
      cp: new UntypedFormControl(data.zip, Validators.required),
      ext: new UntypedFormControl(data.ext, Validators.required),
      int: new UntypedFormControl(data.int),
      city: new UntypedFormControl(data.city, Validators.required),
      state: new UntypedFormControl(data.state, Validators.required),
    }
  }

  public static FormDevice(device?: oDevice) {
    let data = cDevice

    if (device) data = device

    return {
      model: new UntypedFormControl(data.device, Validators.required),
      IMEI: new UntypedFormControl(data.IMEI, Validators.required),
      ID: new UntypedFormControl(data.id),
    }
  }

  public static FormFinancial(financial?: oFinancial) {
    let data = cFinancial

    if (financial) data = financial

    data.credit_type = "Arrendamiento"
    // data.deadlines.weeks = cBusinessDeadlines

    return {
      total: new UntypedFormControl(data.total, [Validators.required, Validators.min(1)]),
      initial: new UntypedFormControl(data.initial, [Validators.required]),
      financed: new UntypedFormControl(data.financed, Validators.min(1)),
      weeklyPayment: new UntypedFormControl(data.weeklyPayment, [Validators.required, Validators.min(1)]),
      deadlines: new UntypedFormControl(data.deadlines, [Validators.required]),
      initDate: new UntypedFormControl(data.initDate),
      provider: new UntypedFormControl(data.provider),

      credit_type: new UntypedFormControl(data.credit_type ? data.credit_type : 0),
      interest_rate: new UntypedFormControl(data.interest_rate ? data.interest_rate : 0), // interes credit dynamic
      commission_opening: new UntypedFormControl(data.commission_opening ? data.commission_opening : 0),
      interest_arrears: new UntypedFormControl(data.interest_arrears ? data.interest_arrears : 0), // intereses moratorios dynamic

      amount_commission_opening: new UntypedFormControl(data.amount_commission_opening), // comision por apertura dynamic
      principal_disbursed: new UntypedFormControl(data.principal_disbursed),
      expected_disbursed: new UntypedFormControl(data.expected_disbursed)
    }
  }

  public static CreateContractFromFormObj(data: any, finalPay: number) {
    const date = new Date()

    const device: oDevice = {
      device: data["device"][0].model,
      id: data["device"][0].ID,
      IMEI: data["device"][0].IMEI
    }
    const address: oAddress = {
      street: data["address"][0].street,
      city: data["address"][0].city,
      neighbor: data["address"][0].neighbor,
      zip: data["address"][0].cp,
      ext: data["address"][0].ext,
      int: data["address"][0].int,
      state: data["address"][0].state
    }

    const financial: oFinancial = {
      total: Number(data["financial"][0].total),
      initial: data["financial"][0].initial,
      deadlines: data["financial"][0].deadlines,
      progress: [],
      pendingOf: [],
      weeklyPayment: data["financial"][0].weeklyPayment,
      interest: data["financial"][0].interest_rate,
      finalDate: date.getTime() + (data["financial"][0].deadlines.weeks * (604800 * 1000)),
      initDate: date.getDate(),
      dayCut: date.getDate(),
      provider: data["financial"][0].provider,
      finalPayment: finalPay,
      financed: data["financial"][0].financed,
      nextPayment: data["financial"][0].nextPayment
    }
    if (data["financial"][0].provider == eProvider.DynamiCore) {
      financial.initial = data["financial"][0].amount_commission_opening ? Number(data["financial"][0].amount_commission_opening) : 0
      financial.expected_disbursed = data["financial"][0].expected_disbursed ? Number(data["financial"][0].expected_disbursed) : 0
      financial.principal_disbursed = data["financial"][0].principal_disbursed ? Number(data["financial"][0].principal_disbursed) : 0
      financial.interest_arrears = data["financial"][0].interest_rate ? Number(data["financial"][0].interest_rate) : 0
      financial.commission_opening = data["financial"][0].commission_opening ? Number(data["financial"][0].commission_opening) : 0
      financial.credit_type = data["financial"][0].credit_type ? data["financial"][0].credit_type : ""
      financial.clabe = data["financial"][0].clabe ? data["financial"][0].clabe : ""
    }

    if (data["financial"][0].amount_commission_opening != undefined) {
      if (Number(data["financial"][0].amount_commission_opening) > 0)
        financial.initial = Number(data["financial"][0].amount_commission_opening)
      else
        financial.initial = Number(data["financial"][0].initial)
    }

    if (Number(data["financial"][0].amount_commission_opening) > 0)
      financial.amount_commission_opening = Number(data["financial"][0].amount_commission_opening)
    else
      financial.amount_commission_opening = financial.initial

    if (financial.nextPayment == undefined) financial.nextPayment = 0

    const contract: oContract = {
      id: "",
      client: "",
      address: address,
      device: device,
      financial: financial,
      by: "",
      active: true,
      lastPayment: date.getTime(),
      createdAt: date.getTime()
    }
    return contract
  }

  public static CreateContractToConektaObj(data: oContract, monthlyPay: number, finalPay: number) {
    const o: any = {}

    const device: oDevice = {
      device: data.device.device,
      id: data.device.id,
      IMEI: data.device.IMEI
    }
    const address: oAddress = {
      street: data.address.street,
      city: data.address.city,
      neighbor: data.address.neighbor,
      zip: data.address.zip,
      ext: data.address.ext,
      int: data.address.int,
      state: data.address.state
    }
    const financial: oFinancial = {
      total: data.financial.total,
      initial: data.financial.initial,
      deadlines: data.financial.deadlines,
      progress: data.financial.progress,
      pendingOf: data.financial.pendingOf,
      weeklyPayment: data.financial.weeklyPayment,
      interest: data.financial.interest,
      finalDate: data.financial.finalDate,
      initDate: data.financial.initDate,
      dayCut: data.financial.dayCut,
      provider: data.financial.provider,
      finalPayment: data.financial.finalPayment,
      financed: data.financial.financed,
      nextPayment: data.financial.nextPayment
    }
    const contract: oContract = {
      id: "",
      client: "",
      address: address,
      device: device,
      financial: financial,
      by: "",
      active: true
    }
    return contract
  }

  public static CreateAuthForm(username: string, curp: string) {
    const password: string = this.createPassword(curp)
    return {
      username: new UntypedFormControl(username, Validators.required),
      password: new UntypedFormControl(password, Validators.required),
    }
  }

  public static createPassword(curp: string): string {
    const _curp = curp.split("")
    let password = ""
    const limit = 7

    if (_curp.length < 16) return ""

    password += _curp[0].toLowerCase()

    for (let i = 1; i <= limit; i++)
      password += _curp[i].toUpperCase()

    password += `*`
    return password
  }

  public static MapperTypeContCli_Contract(_contract: tyClientContract): oContract {
    const contract: oContract = {
      id: _contract.contract!,
      client: _contract.client,
      address: _contract.address,
      device: _contract.device,
      financial: _contract.financial,
      by: _contract.by,
      active: _contract.active,
      lastPayment: _contract.lastPayment,
      createdAt: _contract.createdAt,
      dynamicAccount: _contract.dynamicAccount,
    }

    return contract
  }

  public static MapperSyncContractDynamic(base: oContract, account: IDCAccount): oContract {
    let nContract = base
    let _financial = base.financial
    let _device = base.device


    const financial: oFinancial = {
      total: _financial.total,
      initial: account.properties.amount_commission_opening ? account.properties.amount_commission_opening : _financial.initial,
      deadlines: _financial.deadlines,
      progress: _financial.progress ? _financial.progress : [],
      pendingOf: _financial.pendingOf ? _financial.pendingOf : [],
      weeklyPayment: _financial.weeklyPayment,
      interest: _financial.interest,
      finalDate: _financial.finalDate,
      initDate: _financial.initDate,
      dayCut: _financial.dayCut,
      provider: _financial.provider,
      finalPayment: _financial.finalPayment,
      financed: _financial.financed,
      nextPayment: _financial.nextPayment ? _financial.nextPayment : 0,

      amount_commission_opening:
      account.properties.amount_commission_opening,

      expected_disbursed:
        account.properties.expected_disbursed ?
          Number(account.properties.expected_disbursed) :
          Number(_financial.expected_disbursed),

      principal_disbursed:
        account.properties.principal_disbursed ?
          account.properties.principal_disbursed :
          _financial.principal_disbursed,

      commission_opening:
        account.config.commission_opening ?
          Number(account.config.commission_opening) :
          Number(_financial.commission_opening),

      credit_type:
        account.config.credit_type ? account.config.credit_type : _financial.credit_type,

      clabe:
        String(account.properties.clabe ? account.properties.clabe : _financial.clabe)
    }

    const interestArrears = account.config.interest_arrears
    const prevInterestArrears = _financial.interest_arrears
    if (interestArrears != undefined) {
      financial.interest_arrears = interestArrears
    } else if (prevInterestArrears != undefined) {
      financial.interest_arrears = prevInterestArrears
    } else {
      financial.interest_arrears = 0
    }

    const interest = account.config.interest_rate
    const prevInterest = _financial.interest
    if (interest != undefined) {
      financial.interest = interest
    } else if (prevInterest != undefined) {
      financial.interest = prevInterest
    } else {
      financial.interest = 0
    }

    if (account.properties.amount_commission_opening != undefined) {
      if (Number(account.properties.amount_commission_opening) > 0) {
        financial.initial = Number(account.properties.amount_commission_opening)
        financial.amount_commission_opening = Number(account.properties.amount_commission_opening)
      } else {
        financial.initial = Number(_financial.initial)
        financial.amount_commission_opening = financial.initial
      }
    }

    const seller: string | undefined = account.properties.seller_name
    nContract.by = seller != null ? seller : ""

    nContract.device.id = _device.id ? _device.id : ""

    nContract.financial = financial
    return nContract
  }
}

