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
  account_name?: string,
  account_balance?: string,
  account_type?: string,
  account_code?: string,
  bank_name?: string,
  description?: string,
  currency?: string,
  account_number?: string,
  bill_no?: string,
  order_no?: string,
  notes?: string,
  created_by?: number,
  startDate?: any,
  endDate?: any,
  amount_inexcess?: string,
  deposit_to?: string
}