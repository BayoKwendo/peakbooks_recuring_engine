export default interface Bet {
  id?: number,
  page_number?: number,
  offset?: number,
  customer_id?: string,
  statement_invoice?: string,
  invoice_no?: string,
  terms?: string,
  due_date?: string,
  created_by?: number,
  message_invoice?: string,
  invoice_date?: string,
  estimate_date?: string,
  expiry_date?: string,
  estimate_message?: string,
  estimate?: string,
  tax_exclusive?: string,
  amount?: string,
  due_amount?: string,
  tax_amount?: string,

  sales_person?: string,


  discount_amount?: string,
  sub_total?: string,
  estimate_no?: string,
  pdf?: string,
  statement_message?: string,
  filter_value?: any,
  start_time?: string,
  page_size?: number,
  end_time?: string,
  frequecy?: string,
  recurring?: string,
  frequency_type?: string,
  bill_no?: string,
  sales_person_id?: string,
  bill_date?: string,
  notes?: string,
  vendor_id?: string,
  startDate?: any,
  endDate?: any,
  tax_inclusive?: string
}
