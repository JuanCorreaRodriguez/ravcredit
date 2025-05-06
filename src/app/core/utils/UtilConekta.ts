import {
  oConektaNewOrder,
  oConektaNewOrderAntifraudInfo,
  oConektaNewOrderCharge,
  oConektaNewOrderCustomerInfo,
  oConektaNewOrderLineItem,
  oConektaNewOrderPymMethod,
  oConektaOrderCreate
} from "../interfaces/oConekta";
import {oClient} from "../interfaces/oClient";
import {oContract} from "../interfaces/oContract";

export enum ePaymentType {
  OXXO = "OXXO",
  ALTERNA = "ALTERNA",
  OXXO_RECURRENT = 'oxxo_recurrent'
}

export class FactoryConekta {
  public static createOrder(
    client: oClient,
    contract: oContract,
    dateTime?: number
  ): oConektaNewOrder {

    if (client.conekta_id == undefined) return {
      data: {
        charges: [],
        currency: "",
        customer_info: {customer_id: ""},
        line_items: []
      },
      id: ""
    }

    const customer_info: oConektaNewOrderCustomerInfo = {
      customer_id: client.conekta_id
    }
    const method: oConektaNewOrderPymMethod = {
      type: "cash",
      expires_at: new Date().getTime() * 1000,
    }
    const charge: oConektaNewOrderCharge = {
      amount: contract.financial.weeklyPayment * 100,
      payment_method: method
    }
    const charges = [charge]

    const antifraud_info: oConektaNewOrderAntifraudInfo = {
      newKey: "Key"
    }

    const lineItem: oConektaNewOrderLineItem = {
      antifraud_info: antifraud_info,
      name: `Referencia credito ${client.name}`,
      quantity: 1,
      unit_price: contract.financial.weeklyPayment * 100,
    }

    const lineItems: oConektaNewOrderLineItem[] = [lineItem]

    const orderData: oConektaOrderCreate = {
      customer_info: customer_info,
      charges: charges,
      currency: "MXN",
      line_items: lineItems
    }

    const order: oConektaNewOrder = {
      data: orderData,
      id: client.id
    }

    if (dateTime != undefined) order.date = dateTime

    return order
  }
}
