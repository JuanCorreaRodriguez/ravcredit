import {cNotification, oNotification} from "../interfaces/oNotification";
import {UntypedFormControl, Validators} from "@angular/forms";

export const ROUTE_NOTIFICATIONS = "notifications"
export const ROUTE_GLOBAL_REFERENCE2 = "/contract-reference"

const prodFunction = "https://us-central1-ravcredit-2b079.cloudfunctions.net/CustomerNotification"
const prodFunction2 = "https://customernotification-2imgfxveka-uc.a.run.app"
const localTest = "http://127.0.0.1:5001/ravcredit-2b079/us-central1/CustomerNotification"
export const ravCreditFunctions = prodFunction

export class FactoryNotification {

  public static FormNotification(notification?: oNotification) {
    let data = cNotification

    if (notification) data = notification

    return {
      title: new UntypedFormControl(data.notification.title, [Validators.required, Validators.min(1)]),
      body: new UntypedFormControl(data.notification.body, [Validators.required, Validators.min(1)]),
    }
  }

  public static CreateGlobalNotificationObj(data: oNotification) {
    const o: any = {}

    if (data.notification) {
      const not: any = {}
      if (data.notification.body) not["body"] = data.notification.body
      if (data.notification.title) not["title"] = data.notification.title

      if (data.ids) not["ids"] = data.ids

      if (data.tokens) not["tokens"] = data.tokens

      if (data.type) not["type"] = data.type

      if (data.data) if (data.data.route) not["route"] = data.data.route

      o["data"] = not
    }
    return o
  }

}
