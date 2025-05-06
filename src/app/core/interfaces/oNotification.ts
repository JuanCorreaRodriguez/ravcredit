export const cTopic = "RavCreditClients"

export enum eNotificationType { GLOBAL = "global", USER = "user", PAYMENT = "payment" }

export interface oNotificationResponses {
  successCount: number,
  failureCount: number,
}

export interface oNotification {
  ids?: string[];
  type?: string,
  tokens?: string[],
  topic?: string,
  notification: {
    title: string,
    body: string
  },
  data: any,
  notification_id?: number,
  recipient?: string,
  responses?: oNotificationResponses
}

export const cNotification: oNotification = {
  notification: {
    title: "",
    body: ""
  },
  data: {
    route: ""
  }
}

