export enum eConektaRes {
  CUSTOMER_CREATED = 'customer.created',
  ORDER_PENDING_PAYMENT = 'order.pending_payment',
  ORDER_CREATED = 'order.created',
  CHARGE_CREATED = 'charge.created',
  ORDER_PAID = 'order.paid',
  CHARGE_PAID = 'charge.paid',
}

export enum eConektaOrderStatus {
  expired = 'expired',
  paid = 'paid',
  pending_payment = 'pending_payment',
}

export interface oConektaResObjChargePaid {
  id: string,
  livemode: boolean
  created_at: number
  currency: string
  payment_method: any
  object: string
  description: string
  status: string
  amount: number
  paid_at: number
  fee: number
  customer_id: string
  order_id: string
}

export interface oConektaCustomerInfo {
  email: string;
  phone: string | null;
  name: string;
  corporate: boolean;
  customer_id: string;
  object: string;
  customer_custom_reference: string | null;
}

export interface oConektaChannel {
  segment: string;
  checkout_request_id: string;
  checkout_request_type: string;
  id: string;
}

export interface oConektaCheckout {
  id: string;
  name: string;
  livemode: boolean;
  emails_sent: number;
  success_url: string;
  failure_url: string;
  payments_limit_count: number | null;
  paid_payments_count: number;
  status: string;
  type: string;
  recurrent: boolean;
  starts_at: number;
  expires_at: number;
  allowed_payment_methods: string[];
  needs_shipping_contact: boolean;
  redirection_time: number | null;
  metadata: object;
  can_not_expire: boolean;
  object: string;
  is_redirect_on_failure: boolean;
  slug: string;
  url: string;
}

export interface oConektaLineItem {
  name: string;
  description: string | null;
  unit_price: number;
  quantity: number;
  sku: string | null;
  tags: string[] | null;
  brand: string | null;
  type: string | null;
  object: string;
  id: string;
  parent_id: string;
  metadata: object;
  antifraud_info: object;
}

export interface oConektaLineItems {
  object: string;
  has_more: boolean;
  total: number;
  data: oConektaLineItem[];
}

export interface oConektaCharges {
  object: string;
  has_more: boolean;
  total: number;
  data: oConektaChargeData[];
}

export interface oConektaPaymentMethod {
  service_name: string;
  barcode_url: string;
  store: string;
  auth_code: number;
  object: string;
  type: string;
  expires_at: number;
  store_name: string;
  reference: string;
  cashier_id: string;
}

export interface oConektaChargeData {
  id: string;
  livemode: boolean;
  created_at: number;
  currency: string;
  failure_code: string | null;
  failure_message: string | null;
  channel: oConektaChannel;
  payment_method: oConektaPaymentMethod;
  object: string;
  device_fingerprint: string;
  description: string;
  is_refundable: boolean;
  reference_id: string | null;
  status: string;
  amount: number;
  paid_at: number;
  customer_id: string;
  order_id: string;
  is_button_premia: boolean;
  refunds: string | null;
}

export interface oConektaResObjOrderPaid {
  livemode: boolean
  amount: number
  currency: string
  payment_status: string
  amount_refunded: number
  customer_info: oConektaCustomerInfo,
  object: string
  id: string
  metadata: any
  is_refundable: boolean
  created_at: number
  updated_at: number
  line_items: any
  charges: any
}

export interface oConektaCustomerInfo {
  email: string;
  phone: string | null;
  name: string;
  corporate: boolean;
  customer_id: string;
  object: string;
  customer_custom_reference: string | null;
}

export interface oConektaOrder {
  livemode: boolean;
  amount: number;
  currency: string;
  payment_status: string;
  amount_refunded: number;
  customer_info: oConektaCustomerInfo;
  shipping_contact: string | null;
  channel: oConektaChannel;
  fiscal_entity: string | null;
  object: string;
  id: string;
  metadata: object;
  is_refundable: boolean;
  created_at: number;
  updated_at: number;
  checkout: oConektaCheckout;
  is_button_premia: boolean;
  line_items: oConektaLineItems;
  shipping_lines: string | null;
  tax_lines: string | null;
  discount_lines: string | null;
  charges: oConektaCharges;
}

export interface oConektaOrdersResponse {
  next_page_url: string | null;
  previous_page_url: string | null;
  has_more: boolean;
  object: string;
  data: oConektaOrder[];
}

/******************************************************* Order Create */
export interface oConektaNewOrderCustomerInfo {
  customer_id: string;
}

export interface oConektaNewOrderPymMethod {
  expires_at: number;
  type: string;
}

export interface oConektaNewOrderCharge {
  payment_method: oConektaNewOrderPymMethod;
  amount: number;
}

export interface oConektaNewOrderAntifraudInfo {
  newKey: string;
}

export interface oConektaNewOrderLineItem {
  antifraud_info: oConektaNewOrderAntifraudInfo;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface oConektaOrderCreate {
  customer_info: oConektaNewOrderCustomerInfo;
  charges: oConektaNewOrderCharge[];
  currency: string;
  line_items: oConektaNewOrderLineItem[];
}

export interface oConektaNewOrder {
  data: oConektaOrderCreate;
  date?: number,
  id: string
}

/* ****************************************************************************** */

export interface oConektaResPrevAttr {
  status: string
}

export interface oConektaResData {
  object: oConektaResObjChargePaid | oConektaResObjOrderPaid
  previous_attributes: oConektaResPrevAttr
}

export interface iConektaResObjChargePaidMethod {
  barcode_url: string
  expires_at: number
  object: string
  reference: string
  service_name: string
  store: string
  type: string
}

export interface iConektaResObjChargePaid {
  id: string,
  livemode: boolean
  created_at: number
  currency: string
  payment_method: iConektaResObjChargePaidMethod
  object: string
  description: string
  status: string
  amount: number
  paid_at: number
  fee: number
  customer_id: string
  order_id: string
}

export interface iConektaResPrevAttr {
  status: string;
}

export interface iConektaResData {
  object: iConektaResObjChargePaid;
  previous_attributes: iConektaResPrevAttr;
}

export interface oConektaRes {
  client_id?: string
  data: iConektaResData
  livemode: false,
  webhook_status: string
  webhook_logs: any[],
  id: string
  object: string
  type: eConektaRes
  created_at: number
}

/******************************************************* New reference res */
export interface iConektaSources {
  type: string,
  expires_at?: number
}

export interface iOxxorecurrentSourcesData {
  id: string,
  object: string,
  type: string,
  provider: string,
  reference: string,
  barcode: string,
  barcode_url: string,
  expires_at: number,
  created_at: number,
  parent_id: string
}

export interface iOxxoRecurrentSources {
  object: string,
  has_more: boolean,
  total: number,
  data: iOxxorecurrentSourcesData[]
}

export interface iConektaRecurrent {
  corporate: boolean,
  created_at: number,
  customer_reference?: string
  email: string
  id: string
  livemode: boolean,
  name: string
  phone: string
  object: string
  custom_id: string,
  payment_sources: iOxxoRecurrentSources
}

/******************************************************* New reference constant */
export const cOxxorecurrentSourcesData: iOxxorecurrentSourcesData = {
  id: "",
  object: "",
  type: "",
  provider: "",
  reference: "",
  barcode: "",
  barcode_url: "",
  expires_at: 0,
  created_at: 0,
  parent_id: ""
}

export const cOxxoRecurrentSources: iOxxoRecurrentSources = {
  object: "",
  has_more: false,
  total: 0,
  data: []
}

export const cConektaRecurrent: iConektaRecurrent = {
  livemode: false,
  name: "",
  email: "",
  phone: "",
  id: "",
  object: "",
  created_at: 0,
  corporate: false,
  custom_id: "",
  payment_sources: cOxxoRecurrentSources
}

//
// {
//   data: {
//     object: {
//       id: '66bf1b25e341ed00158a169a',
//       livemode: false,
//       created_at: 1723800357,
//       currency: 'MXN',
//       payment_method: [Object],
//       object: 'charge',
//       description: 'Payment from order',
//       status: 'paid',
//       amount: 28125,
//       paid_at: 1723800396,
//       fee: 1273,
//       customer_id: '',
//       order_id: 'ord_2wTWbvyFgywHDvTZg'
//     },
//     previous_attributes: { status: 'pending_payment' }
//   },
//   livemode: false,
//   webhook_status: 'pending',
//   webhook_logs: [
//     {
//       id: 'webhl_2wTWcRE8ThHpvG1QQ',
//       url: 'https://b1b6-2806-230-2610-b3ed-dcbe-6d32-758f-17c6.ngrok-free.app/api/v1/webhook',
//       failed_attempts: 0,
//       last_http_response_status: -1,
//       response_data: null,
//       object: 'webhook_log',
//       last_attempted_at: 0
//     }
//   ],
//   id: '66bf1b4c2973ff0001dff653',
//   object: 'event',
//   type: 'charge.paid',
//   created_at: 1723800396
// }
