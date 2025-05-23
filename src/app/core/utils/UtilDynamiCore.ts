import {oClient} from "../interfaces/oClient";
import {oContract} from "../interfaces/oContract";
import {UntypedFormControl, Validators} from "@angular/forms";

export enum eReferenceStatusRav {
  "Disponible" = "Disponible",
  "Active" = "Activo con credito vigente",
  "ActiveEnded" = "Activo sin credito vigente",
  "Registered" = "Registrado",
  "NonRegistered" = "No registrado",
  "NonVerified" = "No verificado",
  "Rejected" = "Rechazado",
  "Pending" = "Pendiente"
}

export enum eAccountDynamicStatus {
  "OK" = "Con cuenta activa",
  "NOK" = "Sin cuenta activa",
}

//
// export enum eAccountDynamicRegister {
//   "Active" = "Activo", // Ok
//   "NonAuthorized" = "No autorizado",
//   "Authorized" = "Autorizado", // Non ref
//   "Accepted" = "Aceptado", // Non ref
//   "Rejected" = "Rechazado", // Non ref
//   "Pending" = "Pendiente", // Non ref
//   "NotFound" = "No registrado"
//   }

export enum eClientDynamicStatus {
  "Active" = "Active",
  "Pending" = "Pending",
  "Accepted" = "Accepted",
  "Rejected" = "Rejected",
  "approved" = "Aprobado",
}

export const cClientDynamicStatus = {
  Active: {
    value: "Active",
    viewValue: "Activo"
  },
  Pending: {
    value: "Pending",
    viewValue: "Pendiente"
  },
  Accepted: {
    value: "Accepted",
    viewValue: "Pre autorizado"
  },
  Rejected: {
    value: "Rejected",
    viewValue: "Rechazado"
  },
  Idle: {
    value: "Idle",
    viewValue: ""
  },
}

export enum eContractSteps {
  "idle" = "idle",
  "general" = "General",
  "address" = "Address",
  "device" = "Device",
  "financial" = "Financial",
  "app" = "App",
}

export type partialIDCData = Pick<IDCClient, "pii" | "client_type">

export interface IDCCharge {
  barcode_url: string;
  currency: string;
  expires_at: number;
  object: string;
  quantity: number;
  reference: string;
  service_name: string;
  store_name: string;
  type: string;
  unit_price: number;
}

export interface IDCGeneratedReference {
  account: number;
  active: number;
  amount: number;
  channel: string;
  charge: IDCCharge;
  company: number;
  config?: any;
  id: string;
  operation: number;
}

export const cIDCDataPii: IDCDataPii = {
  icc: "",
  rfc: "",
  sex: "",
  city: "",
  curp: "",
  days: "",
  imei: "",
  name: "",
  step: "",
  term: "",
  brand: "",
  email: "",
  model: "",
  phone: "",
  score: "",
  state: "",
  amount: "",
  colony: "",
  period: "",
  street: "",
  ticket: "",
  num_ext: "",
  num_int: "",
  zipcode: "",
  evidence: "",
  financed: "",
  house_is: "",
  lastname: "",
  type_job: "",
  birthdate: "",
  birthstate: "",
  dicio_data: "",
  dicio_step: "",
  secondname: "",
  nationality: "",
  seller_name: "",
  down_payment: "",
  municipality: "",
  score_no_hit: "",
  study_degree: "",
  branch_office: "",
  identity_data: "",
  interest_rate: "",
  score_interno: "",
  marital_status: "",
  monthly_income: "",
  motherlastname: "",
  score_rcc_fico: "",
  identity_selfie: "",
  amount_by_period: "",
  identity_id_back: "",
  proof_of_address: "",
  identity_id_front: "",
  economic_dependents: "",
  identity_id_request: "",
  identity_verification: "",
  is_address_ine_currently_live: "",
  fotografia_del_cliente_con_el_equipo: "",
  estado: "",
  gender: ""
}

/**
 * Base customer for create customer with DynamiCore provider
 * */
export const cIDCCustomer: partialIDCData = {
  pii: cIDCDataPii,
  client_type: 662
}

export interface IDCDataPii {
  icc: string,
  rfc: string,
  city: string,
  curp: string,
  sex: string,
  days: string,
  step: string,
  ticket: string,
  evidence: string,
  proof_of_address: string,
  score_interno: string,
  imei: string,
  name: string,
  term: string,
  brand: string,
  email: string,
  model: string,
  phone: string,
  score: any,
  state: string,
  amount: string,
  colony: string,
  estado: any,
  gender: string,
  period: string,
  street: string,
  num_ext: string,
  num_int: string,
  zipcode: string,
  financed: string,
  house_is: string,
  lastname: string,
  type_job: string,
  birthdate: string,
  birthstate: string,
  dicio_data: string,
  dicio_step: any,
  secondname: string,
  nationality: string,
  seller_name: string,
  down_payment: string,
  municipality: string,
  score_no_hit: string,
  study_degree: string,
  branch_office: string,
  identity_data: any,
  interest_rate: string,
  marital_status: string,
  monthly_income: string,
  motherlastname: string,
  score_rcc_fico: string,
  identity_selfie: any,
  amount_by_period: string,
  identity_id_back: any,
  identity_id_front: any,
  economic_dependents: string,
  identity_id_request: any,
  identity_verification: any,
  is_address_ine_currently_live: string,
  fotografia_del_cliente_con_el_equipo?: string
}

export interface IDCAccountProps {
  clabe: string | number,
  pagaqui: string | number,
  start_date: string,
  expected_disbursed: number,
  reference_pagaaqui: string,
  principal_disbursed: number,
  amount_commission_opening: number,
  seller_name?: string
}

export interface IDCAccountConfig {
  contract: string,
  credit_type: string,
  periodicity: string,
  installments: number,
  interest_base: string,
  interest_rate: number,
  interest_arrears: number,
  commission_opening: number,
  financed_amount?: number
}

export interface IDCAccount {
  id: number | string,
  group: number,
  company: number,
  client: number,
  created_at: string,
  currency: string | number,
  status: string,
  properties: IDCAccountProps,
  product: number,
  enabled: string | number,
  config: IDCAccountConfig,
  amount: number,
  type: string,
  identifier: string,
  start_at: string,
  el: any,
  client_id: string | number
}

export interface IDCTxnRowExtras {
  reference: string,
  transaction: string
}

export interface IDCTxnRow {
  id: string,
  created_at: string,
  seq: number,
  created: string,
  last4: string,
  response: any,
  transaction_id: string,
  contrapart: string,
  reference: string,
  external_reference: any,
  extras: IDCTxnRowExtras,
  name: string,
  debit: number,
  credit: number,
  amount: number
}

export interface IDCTxnHeader {
  name: string,
  type: string,
  label?: string,
  money?: string,
  format?: string
}

export interface IDCTxn {
  rows: IDCTxnRow[],
  headers: IDCTxnHeader[]
}

export interface IDCMntryCycle {
  date: string,
  late: number,
  paid: number,
  past: string | boolean,
  cycle: string | number,
  amount: number,
  detail: any,
  status: string
}

export interface IDCMntryPymtAllPaidTotal {
  amount: string,
  cycles: string
}

export interface IDCMntryPymtAll {
  late: number,
  total: number,
  va_cp: number,
  actual: number,
  cycles: IDCMntryCycle[],
  vencido: number,
  paid_total: IDCMntryPymtAllPaidTotal,
  total_amount: number
}

export interface IDCMntryPymtDue {
  total: number,
  cycles: IDCMntryCycle[],
  new_cycle: IDCMntryCycle,
  old_cycle: IDCMntryCycle,
  total_amount: number
}

export interface IDCMntryPymtOpen extends IDCMntryPymtDue {
}

export interface IDCMntryPymtPaid {
  total: number,
  cycles: IDCMntryCycle[] | any[],
  new_cycle: any,
  old_cycle: any,
  total_amount: number
}

export interface IDCMntryPymtDueTax {
  expected: number;
}

export interface IDCMntryPymtPymt {
  paid: number,
  expected: number
}

export interface IDCMntryPymtCal {
  due: IDCMntryPymtDue,
  date: string,
  past: string,
  cycle: number,
  balance: number,
  due_tax: IDCMntryPymtDueTax,
  payment: IDCMntryPymtPymt,
  interest: IDCMntryPymtPymt,
  principal: IDCMntryPymtPymt,
  payment_tax: IDCMntryPymtPymt,
  interest_tax: IDCMntryPymtPymt,
  final_balance: number,
  payment_total: IDCMntryPymtPymt,
  principal_tax: IDCMntryPymtPymt
}

export interface IDCMntryPymt {
  all: IDCMntryPymtAll,
  due: IDCMntryPymtDue,
  open: IDCMntryPymtOpen,
  paid: IDCMntryPymtPaid,
  payment_calendar: IDCMntryPymtCal[]
}

export interface IDCClient {
  id: number,
  company: number,
  status: string,
  external_id: string,
  pii: IDCDataPii,
  client_type: number,
  created_at: string,
  pd: number,
  username: string,
  group: number
}

export interface IDCMsg {
  code: number,
  total: number,
  data: IDCClient[] | IDCAccount[] | IDCTxn[] | IDCTxn | IDCMntryPymt | IDCCredit[] | IDCTransaction[],
  transaction?: string
}

export interface IDynamiCore {
  status: string,
  message: IDCMsg
}

/**
 * Interfaces for request (base)
 * */
export interface IDCClientObjFilter {
  name: string,
  filter: string[] | number[],
  type: string,
  sort: string
}

export interface IDCClientQuery {
  filters: IDCClientObjFilter[];
}

export interface IDCClientPiiFilter {
  limit: number,
  page: number,
  query: IDCClientQuery
}

/**
 * DynamiCore Reference Interface
 * */

export interface IDCRefCustInfo {
  name: string,
  email: string,
  phone: string | number
}

export interface IDCOxxoRefItem {
  name: string,
  unit_price: number,
  quantity: number
}

export interface IDCOxxoRefPymtMth {
  type: string;
}

export interface IDCOxxoRef {
  account: number,
  operation: number,
  customer_info: IDCRefCustInfo,
  items: IDCOxxoRefItem,
  payment_method: IDCOxxoRefPymtMth
}

/**
 * DynamiCore Reference
 * */
export interface IDCRefCustInfo {
  name: string,
  email: string,
  phone: string | number
}

export interface IDCRefItems {
  name: string,
  unit_price: number,
  quantity: number
}

export interface IDCRefPymtMethod {
  type: string;
}

export interface IDCNewReference {
  id: string,
  data: IDCReference,
  date?: number
}

export interface IDCReference {
  account: number,
  operation: number,
  customer_info: IDCRefCustInfo,
  items: IDCRefItems,
  payment_method: IDCRefPymtMethod
}

/**
 *  Interfaces to Credits
 *  */
export interface IDCCreditProperties {
  start_date: string;
  principal_disbursed: number;
  expected_disbursed: number;
  amount_commission_opening: number;
}

export interface IDCCreditConfig {
  contract: string;
  credit_type: string;
  interest_rate: number;
  installments: number;
  periodicity: string;
  interest_base: string;
  commission_opening: number;
  financed_amount: number;
  interest_arrears: number;
}

export interface IDCCredit {
  id: number;
  group: number;
  company: number;
  client: number;
  created_at: string;
  currency: string;
  status: string;
  properties: IDCCreditProperties;
  product: number;
  enabled: string;
  config: IDCCreditConfig;
  amount: number;
  type: string;
  identifier: null | string;
  start_at: null | string;
}

/**
 *  Payments
 * */
export interface IDCPayment {
  operation: number;
  account: string;
  date: string;
  amount: number;
  external_id?: string;
  dst_account: string;
  extras?: object;
  reference: string;
}

export const cIDCPayment: IDCPayment = {
  operation: 98,
  account: "",
  date: "",
  amount: 0,
  dst_account: "",
  reference: ""
}

/**
 *  Transactions
 * */
export interface IDCTransaction {
  data: [number, { transaction: string }];
}

export const cIDCCharge: IDCCharge = {
  barcode_url: "",
  currency: "",
  expires_at: 0,
  object: "",
  quantity: 0,
  reference: "",
  service_name: "",
  store_name: "",
  type: "",
  unit_price: 0
}

export const cIDCGeneratedReference: IDCGeneratedReference = {
  account: 0,
  active: 0,
  amount: 0,
  channel: "",
  charge: cIDCCharge,
  company: 0,
  id: "",
  operation: 0
}

/**
 * Common Factory Dynamic
 * */
export class FactoryDynamiCore {

  public static CreateReferenceBody(
    client: oClient,
    contract: oContract,
    dateTime?: number
  ): IDCNewReference | null {

    const customerInfo: IDCRefCustInfo = {
      name: client.name,
      email: client.email,
      phone: client.phone,
    }

    const customerItems: IDCRefItems = {
      name: "Referencia Oxxo",
      unit_price: contract.financial.weeklyPayment,
      quantity: 1
    }

    const paymentMethod: IDCRefPymtMethod = {
      type: "oxxo_cash"
    }

    if (!client.dynamic_account) return null

    const body: IDCNewReference = {
      id: client.id,
      data: {
        account: Number(client.dynamic_account),
        operation: 98,
        customer_info: customerInfo,
        items: customerItems,
        payment_method: paymentMethod
      }
    }

    if (dateTime != undefined) body.date = dateTime

    return body
  }

  public static CreateEmptyCustomer(): partialIDCData {
    return cIDCCustomer
  }

  public static CreateCustomerFromOClient(client: oClient, contract: oContract): partialIDCData {
    const o: partialIDCData = cIDCCustomer

    o.pii.email = client.email
    o.pii.name = client.name
    o.pii.curp = client.curp
    o.pii.phone = client.phone
    o.pii.amount = String(contract.financial.total)
    o.pii.financed = String(contract.financial.financed)
    o.pii.amount_by_period = String(contract.financial.weeklyPayment)

    o.pii.zipcode = contract.address.zip
    o.pii.street = contract.address.street
    o.pii.city = contract.address.city
    o.pii.state = contract.address.state
    o.pii.colony = contract.address.neighbor
    o.pii.num_ext = contract.address.ext

    return o
  }

  public static CreateDynamicCredit(
    client: oClient,
    contract: oContract,
    clientDynamic: IDCClient,
  ): Partial<IDCCredit> | null {
    const properties: IDCCreditProperties = {
      start_date: "",
      principal_disbursed: 0,
      expected_disbursed: 0,
      amount_commission_opening: 0
    }

    const config: IDCCreditConfig = {
      contract: `FP-${client.name}`,
      credit_type: "Arrendamiento",
      interest_rate: 528,
      installments: 0,
      periodicity: "WEEK",
      interest_base: "ACT/ACT",
      commission_opening: 40,
      financed_amount: contract.financial.financed,
      interest_arrears: 0
    }

    if (!client.dynamic_account) return null

    return {
      id: Number(client.dynamic_account),
      group: clientDynamic.group,
      company: clientDynamic.company,
      client: clientDynamic.id,
      created_at: "",
      currency: "484",
      status: "pending",
      properties: properties,
      product: 1756,
      enabled: "1",
      config: config,
      amount: 0,
      type: "liabilities",
      identifier: null,
      start_at: null
    }
  }

  public static CreatePayment(
    contract: oContract,
    clientDynamic: IDCAccount,
  ): IDCPayment {
    return {
      account: String(clientDynamic.id),
      amount: contract.financial.weeklyPayment,
      date: "",
      dst_account: String(clientDynamic.id),
      external_id: "",
      extras: {},
      operation: 98,
      reference: ""
    }
  }

  public static getNextDateTime(): string {
    const now = new Date();
    const nextDateTime = new Date(now.getTime() + 1000); // Add 1 second as an example

    const year = nextDateTime.getFullYear();
    const month = String(nextDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(nextDateTime.getDate()).padStart(2, '0');
    const hours = String(nextDateTime.getHours()).padStart(2, '0');
    const minutes = String(nextDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(nextDateTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  public static getIsoDate(): string {
    const now = new Date();
    return now.toISOString();
  }

  public static FormPayment(
    contract: oContract,
    account: IDCAccount) {

    let data = FactoryDynamiCore.CreatePayment(contract, account)

    return {
      amount: new UntypedFormControl(data.amount, [Validators.required, Validators.min(0)]),
    }
  }
}
