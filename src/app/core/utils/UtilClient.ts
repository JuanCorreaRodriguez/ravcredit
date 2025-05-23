import {oClient, oUserReference} from "../interfaces/oClient";
import {cConektaRecurrent, iConektaRecurrent, iConektaSources} from "../interfaces/oConekta";
import {eClientStatus, tyClientContract} from "../interfaces/oGlobal";
import {IDCAccount, IDCClient} from "./UtilDynamiCore";
import {cContract} from "./UtilContract";
import {oContract} from "../interfaces/oContract";
import {oFinancial} from "../interfaces/oFinancial";

export const cClient: oClient = {
  id: "",
  name: "",
  username: "",
  email: "",
  phone: "",
  curp: "",
  contract_temporary: "",
  conekta_id: "",
  userReferences: [],
  status: ""
}

export interface oClientConekta {
  ravcredit: oClient;
  conekta: iConektaRecurrent;
}

export const cUserReference: oUserReference = {
  name: "",
  phone: "",
  relationship: ""
}

export const cClientConekta: oClientConekta = {
  conekta: cConektaRecurrent,
  ravcredit: cClient
}

export interface iClientContract {
  client: oClient;
  contract: oContract;
}

export const cClientContract: iClientContract = {
  client: cClient,
  contract: cContract,
}

export class FactoryClient {

  public static CreateClientToConektaObj(data: oClient) {
    const o: any = {}
    if (data.name && data.name.length > 0) o.name = data.name;
    if (data.username && data.name.length > 0) o.username = data.username;
    if (data.email && data.email.length > 0) o.email = data.email;
    if (data.phone && data.phone.length > 0) o.phone = String(data.phone);
    if (data.curp && data.curp.length > 0) o.curp = data.curp;
    if (data.userReferences && data.userReferences.length > 0) o.userReferences = data.userReferences;
    if (data.contract) o.contract = data.contract;
    if (data.createdAt) o.createdAt = data.createdAt;
    if (data.lastLogin) o.lastLogin = data.lastLogin;
    if (data.conekta_id) o.conekta_id = data.conekta_id;

    return o
  }

  public static CreateClientFromFormObj(data: any, client?: oClient): oClient {
    const o: oClient = {
      id: "",
      name: data["client"][0].name,
      username: data["auth"][0].username,
      password: data["auth"][0].password,
      email: data["client"][0].email,
      phone: String(data["client"][0].phone),
      curp: data["client"][0].curp,
      userReferences: data["client"][0].userReferences,
      status: eClientStatus.ACTIVE
    }

    if (client != undefined) {
      if (client.dynamic_id) o.dynamic_id = client.dynamic_id;
      if (client.dynamic_account) o.dynamic_account = client.dynamic_account;
      if (client.conekta_id) o.conekta_id = client.conekta_id;
    }

    return o
  }

  public static CreateClientConektaObj(data: oClient, finalDate: number) {
    const sources: iConektaSources = {
      type: "oxxo_recurrent",
      expires_at: finalDate
    }
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      contract: data.contract_temporary,
      client_id: data.id,
      payment_sources: [sources]
    }
  }

  public static MapperConektaClient(
    client: oClient,
    conekta: iConektaRecurrent,
  ): iClientContract {
    const o: oClient = client

    o.name = conekta.name
    o.email = conekta.email
    o.phone = conekta.phone
    o.conekta_id = conekta.id

    return {
      client: o,
      contract: cContract
    }
  }

  public static MapperTypeContCli_Client(_client: tyClientContract): oClient {
    const client: oClient = {
      id: _client.id,
      name: _client.name,
      username: _client.username,
      email: _client.email,
      phone: _client.phone,
      curp: _client.curp,
      userReferences: _client.userReferences,
      status: _client.status,
      contract: _client.contract,
      reference: _client.reference,
      references: _client.references,
      conekta_id: _client.conekta_id,
      dynamic_account: _client.dynamic_account,
      token: _client.token,
      contract_temporary: _client.contract_temporary,
      lastLogin: _client.lastLogin,
      dynamic_id: _client.dynamic_id,
      createdAt: _client.createdAt,
      payments: _client.payments,
      password: _client.password,
      contractUrl: _client.contractUrl,
      dynamic_ref: _client.dynamic_ref,
      exists: _client.exists,
      passport_id: _client.passport_id,
    }

    return client
  }

  public static MapperDynamicClient(
    dynamic: IDCClient,
    client: oClient,
    contract: oContract,
    clientDyn?: IDCClient,
    account?: IDCAccount,
  ): iClientContract {
    // const o: tyClientContract = cTyClientContract

    /* Client ------------------------------------------------------ */
    client.username = `${dynamic.pii.name} ${dynamic.pii.motherlastname} ${dynamic.pii.lastname}`
    client.phone = dynamic.pii.phone as string
    client.dynamic_id = dynamic.id
    client.curp = dynamic.pii.curp
    client.email = dynamic.pii.email

    if (account)
      client.dynamic_account = account.id

    /* Auth ---------------------------------------------------------- */


    /* Device -------------------------------------------------------- */
    contract.device.IMEI = clientDyn!.pii.imei
    contract.device.device = clientDyn!.pii.model

    /* Contract ------------------------------------------------------ */
    contract.by = clientDyn!.pii.seller_name

    if (clientDyn!.pii.fotografia_del_cliente_con_el_equipo != undefined) {
      const oPhoto = clientDyn!.pii.fotografia_del_cliente_con_el_equipo!
      if (oPhoto != "") {
        const _photo = JSON.parse(oPhoto)
        if (_photo)
          contract.photo = _photo[0].url
      }
    }

    contract.address.state = dynamic.pii.state
    contract.address.city = dynamic.pii.city
    contract.address.street = dynamic.pii.street
    contract.address.ext = dynamic.pii.num_ext as string
    contract.address.zip = dynamic.pii.zipcode as string
    contract.address.neighbor = dynamic.pii.colony

    /* Financial ------------------------------------------------------ */
    contract.dynamicAccount = Number(account?.id)

    if (account?.config.installments) {
      contract.financial.deadlines = {
        weeks: account.config.installments,
        interest: 0
      }
    }

    if (account?.properties.expected_disbursed)
      contract.financial.total = account?.properties.expected_disbursed

    if (account?.properties.principal_disbursed)
      contract.financial.financed = account?.properties.principal_disbursed

    if (account?.properties.amount_commission_opening) {
      contract.financial.initial = account?.properties.amount_commission_opening
      contract.financial.amount_commission_opening = account?.properties.amount_commission_opening
    }

    contract.financial.interest_rate = Number(clientDyn!.pii.interest_rate)
    contract.financial.interest_arrears = account?.config.interest_arrears
    contract.financial.commission_opening = account?.config.commission_opening
    contract.financial.credit_type = account?.config.credit_type

    contract.financial.principal_disbursed = account?.properties.principal_disbursed
    contract.financial.expected_disbursed = account?.properties.expected_disbursed

    contract.financial.weeklyPayment = Number(clientDyn!.pii.amount_by_period)

    return {
      client: client,
      contract: contract,
    }
  }

  public static MapperFinancialContract(
    contract: oContract,
    account: IDCAccount,
  ): oFinancial {

    contract.dynamicAccount = Number(account.id)

    if (account.config.installments) {
      contract.financial.deadlines = {
        weeks: account.config.installments,
        interest: 0
      }
    }

    const total =
      account.config.financed_amount != undefined ? account.config.financed_amount : 0

    if (total > 0)
      contract.financial.total = total

    // if (account.properties.expected_disbursed)
    const expected_disbursed =
      account.properties.expected_disbursed != undefined ? account.properties.expected_disbursed : 0

    if (expected_disbursed > 0) contract.financial.total = expected_disbursed
    contract.financial.expected_disbursed = expected_disbursed

    contract.financial.interest_rate = account.config.interest_rate
    contract.financial.interest_arrears = account.config.interest_arrears

    // if (account.properties.principal_disbursed)
    if (account.properties.principal_disbursed > 0)
      contract.financial.financed = account.properties.principal_disbursed

    contract.financial.principal_disbursed = account.properties.principal_disbursed

    const amount_commission_opening =
      account.properties.amount_commission_opening != undefined ? account.properties.amount_commission_opening : 0

    if (amount_commission_opening > 0)
      contract.financial.initial = amount_commission_opening

    contract.financial.amount_commission_opening = amount_commission_opening

    contract.financial.interest_arrears = account.config.interest_arrears
    contract.financial.commission_opening = account.config.commission_opening
    contract.financial.credit_type = account.config.credit_type

    contract.financial.clabe = String(account.properties.clabe!)

    return contract.financial
  }
}
