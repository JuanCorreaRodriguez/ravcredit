import {oBusinessDeadlines} from "./oBusiness";

export interface oFinancialProgress {
  id: string;
  amount: number;
  date: number
}

export interface oFinancial {
  total: number,
  initial: number,
  deadlines: oBusinessDeadlines, // length = installments
  initDate?: number
  finalDate?: number
  weeklyPayment: number
  dayCut?: number
  finalPayment?: number
  progress?: oFinancialProgress[],
  pendingOf: string[]
  interest: number,
  provider: string
  financed: number,
  nextPayment: number,
  amount_commission_opening?: number // comision por apertura dynamic
  principal_disbursed?: number // :/
  expected_disbursed?: number // :/
  credit_type?: string // -----------------------
  interest_rate?: number // anual interest credit dynamic %
  commission_opening?: number, // comision por apertura de credito %
  interest_arrears?: number, // intereses moratorios dynamic bps
  clabe?: string
}
