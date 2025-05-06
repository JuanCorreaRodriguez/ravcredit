export interface oCustomer {
  livemode: boolean
  name: string
  email: string
  phone: string
  id: string
  object: string
  created_at: number
  corporate: boolean
  custom_reference: string
}


export interface oCustomerInfo {
  customer_id: string
  name?: string
  email?: string
  phone?: string
}

//
// export interface iCustomerInfo = Pick<iCustomer, email | id | name | phone> {
//
//   customer_id:string
// }
// {
//   livemode: false,
//   name: Vicente Mendoza,
//   email: vicente.mendoza@conekta.com,
//   phone: 5566982093,
//   id: cus_2wHtqBNsSggaYdfXu,
//   object: customer,
//   created_at: 1721258796,
//   corporate: false,
//   custom_reference:
// }
