const localApiDev = "http://localhost:3000"
const prefix = "/api/v1/"
const prodApiDev = "https://ravcredit-api-1059462239029.us-central1.run.app"
const prodApi2 = "https://ravcredit-api-2imgfxveka-uc.a.run.app"

export const ravCreditApi = prodApiDev + prefix
/* Functions */
export const notificationsFun = "http://customernotification-2imgfxveka-uc.a.run.app"
export const testOnRegisterFun = "http://127.0.0.1:5001/ravcredit-2b079/us-central1/onRegister"
export const testOnRegisterFu2 = "http://127.0.0.1:5001/ravcredit-2b079/us-central1/onNewRegister"
export const testOnScanPayment = "http://127.0.0.1:5001/ravcredit-2b079/us-central1/OnScanPayments"

export const OnRegisterFun = "https://us-central1-ravcredit-2b079.cloudfunctions.net/onRegister"
export const OnRegisterFu1 = "https://us-central1-ravcredit-2b079.cloudfunctions.net/onNewRegister"
export const OnRegisterFu2 = "https://onnewregister-2imgfxveka-uc.a.run.app"
export const OnScanPayment = "https://us-central1-ravcredit-2b079.cloudfunctions.net/OnScanPayments"

/* ********* */
// export const OnSendEmail = OnRegisterFu2
export const OnSendEmail = OnRegisterFu2
export const ScanPayment = OnScanPayment

export const endPointAuthAdmin = "auth/login-admin"
export const endPointUserAdmin = "user"

export const endPointClientAdmin = "client/"
export const endPointClientAdminAccess = "update-access/"
export const endPointClientDynamic = "dynamic-core/"
export const endPointClientCreateAdmin = "verify-client"
export const endPointCurpVerificationAdmin = "verify-curp"
export const endPointCurpVerificationDynamic = "curp-filter"
export const endPointAccountVerificationDynamic = "account"
export const endPointAccountGetReferenceDynamic = "get-reference"
export const endPointAccountTransactions = "transactions"

export const endPointDynamiCore = "dynamic-core"
export const endPointDynamiCoreRef = "reference"
export const endPointDynamiCoreCreate = "create-customer"
export const endPointDynamiCoreCreateCredit = "create-credit"
export const endPointDynamiCoreCreatePay = "create-payment"
export const endPointDynamiCoreVerify = "verify-customer"

export const conekta = "conekta"
export const conektaGetOrders = "get-orders"
export const conektaCreateOrder = "create-order"
export const conektaCreateCustomer = "conekta/create-customer"
// export const conektaCreatePaymentOrder = "conekta/create-payment-order"
export const conektaGetCustomer = 'conekta/customer'
export const passportCreateReference = "passport"

export const endPointContractAdmin = "contracts"
export const endPointContractPayments = "contracts/payments"
export const endPointContractPaymentsDelay = "contracts/payment-delay/"
export const endPointContractUpload = "contract-upload"

export const endPointCreateBusinessInfoCrete = "business/create-business-info"
export const endPointCreateBusinessInfo = "business/business-info"
export const endPointUpdateBusinessInfo = "business/update-business-info"
export const endPointCreateBusinessConfig = "business/create-business-config"
export const endPointUpdateBusinessConfig = "business/update-business-config"
export const endPointUpdateBusinessGetConfig = "business/business-config"
export const endPointGetNotifications = "notifications/all"

export const ravCreditApiAuth = `${ravCreditApi}${endPointAuthAdmin}`
export const ravCreditApiUsers = `${ravCreditApi}${endPointUserAdmin}`
export const ravCreditApiClient = `${ravCreditApi}${endPointClientAdmin}`
export const ravCreditApiClientCreate = `${ravCreditApi}${endPointClientAdmin}${endPointClientCreateAdmin}`

export const ravCreditApiClientVerifyRavcredit = `${ravCreditApi}${endPointClientAdmin}${endPointCurpVerificationAdmin}`
export const ravCreditApiClientVerifyDynamic = `${ravCreditApi}${endPointClientDynamic}${endPointCurpVerificationDynamic}`
export const ravCreditApiAccountVerifyDynamic = `${ravCreditApi}${endPointClientDynamic}${endPointAccountVerificationDynamic}`
export const ravCreditApiGetReferenceDynamic = `${ravCreditApi}${endPointClientDynamic}${endPointAccountGetReferenceDynamic}`
export const ravCreditApiGetTransactions = `${ravCreditApi}${endPointClientDynamic}${endPointAccountTransactions}`

export const ravCreditApiClientUpdate = `${ravCreditApi}${endPointClientAdmin}`
export const ravCreditApiClientUpdateAppAccess = `${ravCreditApi}${endPointClientAdmin}${endPointClientAdminAccess}`
export const ravCreditApiContract = `${ravCreditApi}${endPointContractAdmin}`
export const ravCreditApiContractPayments = `${ravCreditApi}${endPointContractPayments}`
export const ravCreditApiContractPaymentsDelay = `${ravCreditApi}${endPointContractPaymentsDelay}`
export const ravCreditApiContractUpload = `${ravCreditApi}${endPointContractAdmin}/${endPointContractUpload}`
export const ravCreditApiContractUpdate = `${ravCreditApi}${endPointContractAdmin}/`
export const ravApiConektaCreateCustomer = `${ravCreditApi}${conektaCreateCustomer}`
export const ravApiConektaGetCustomer = `${ravCreditApi}${conektaGetCustomer}`
// export const ravApiConektaCreateRef = `${ravCreditApi}${conektaCreatePaymentOrder}`
export const ravApiPassportCreateRef = `${ravCreditApi}${passportCreateReference}`

export const ravApiConektaGetOrdersById = `${ravCreditApi}${conekta}/${conektaGetOrders}`
export const ravApiConektaCreateOrder = `${ravCreditApi}${conekta}/${conektaCreateOrder}`

export const ravApiDynamicCoreRef = `${ravCreditApi}${endPointDynamiCore}/${endPointDynamiCoreRef}`
export const ravApiDynamicCoreCreate = `${ravCreditApi}${endPointDynamiCore}/${endPointDynamiCoreCreate}`
export const ravApiDynamicCoreCreateCredit = `${ravCreditApi}${endPointDynamiCore}/${endPointDynamiCoreCreateCredit}`
export const ravApiDynamicCoreCreatePay = `${ravCreditApi}${endPointDynamiCore}/${endPointDynamiCoreCreatePay}`
export const ravApiDynamicCoreVerify = `${ravCreditApi}${endPointDynamiCore}/${endPointDynamiCoreVerify}`

export const ravCreditApiBusinessGetInfo = `${ravCreditApi}${endPointCreateBusinessInfo}`
export const ravCreditApiBusinessUpdateInfo = `${ravCreditApi}${endPointUpdateBusinessInfo}`

export const ravCreditApiBusinessGetConfig = `${ravCreditApi}${endPointUpdateBusinessGetConfig}`
export const ravCreditApiBusinessUpdateConfig = `${ravCreditApi}${endPointUpdateBusinessConfig}`

export const ravCreditApiNotifications = `${ravCreditApi}${endPointGetNotifications}`

// perla92mtz25@gmail.com
// mABP9209*
// CORJ920809HCLRDN02


//
// {
//   data: {
//     object: {
//       livemode: false,
//         amount: 28125,
//         currency: 'MXN',
//         payment_status: 'paid',
//         amount_refunded: 0,
//         customer_info: [Object],
//         object: 'order',
//         id: 'ord_2wTWbvyFgywHDvTZg',
//         metadata: [Object],
//         is_refundable: true,
//         created_at: 1723800357,
//         updated_at: 1723800396,
//         line_items: [Object],
//         charges: [Object]
//     },
//     previous_attributes: {}
//   },
//   livemode: false,
//     webhook_status: 'pending',
//   webhook_logs: [
//   {
//     id: 'webhl_2wTWcRE8ThHpvG1QH',
//     url: 'https://b1b6-2806-230-2610-b3ed-dcbe-6d32-758f-17c6.ngrok-free.app/api/v1/webhook',
//     failed_attempts: 0,
//     last_http_response_status: -1,
//     response_data: null,
//     object: 'webhook_log',
//     last_attempted_at: 0
//   }
// ],
//   id: '66bf1b4c2973ff0001dff64b',
//   object: 'event',
//   type: 'order.paid',
//   created_at: 1723800396
// }
