export interface oClientPayments {
  date: number;
  dayPayment: number;
  amount: number;
  id: string;
}

export interface oUserReference {
  name: string,
  phone: string,
  relationship: string
}

export interface oClientReferences {
  date?: number;
  amount?: number;
  id: string;
  url?: string;
}

export interface oClient {
  id: string
  name: string,
  username: string,
  password?: string,
  email: string,
  phone: string,
  curp: string,
  contract?: string,
  createdAt?: number,
  lastLogin?: number,
  contract_temporary?: string,
  exists?: boolean
  conekta_id?: string
  dynamic_id?: number | string
  dynamic_account?: string | number,
  dynamic_ref?: string,
  passport_id?: string
  payments?: oClientPayments[],
  reference?: string,
  references?: oClientReferences[],
  token?: string
  userReferences: oUserReference[],
  contractUrl?: string,
  status: string,
}

/** CONTRACT
 id: string
 client: string
 address: oAddress
 device: oDevice
 financial: oFinancial
 createdAt?: number
 lastPayment?: number
 by: string
 status: boolean
 */
