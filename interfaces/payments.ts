export default interface Payment {
  id?: string,
  page_number?: number,
  page_size?: number,
  offset?: number,
  client_id?: number,
  customer_id?: string,
  name?: string,
  filter_value?: any,
  invoice_no?: string,
  amount_received?: string,
  payment_date?: string,
  payment_mode?: string,
  reference?: string,
  vendor_id?: string,
  bill_no?: string,
  order_no?: string,

  notes?: string,
  created_by?:number,

  amount_inexcess?: string,
  deposit_to?: string

}