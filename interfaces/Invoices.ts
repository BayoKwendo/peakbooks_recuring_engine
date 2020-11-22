export default interface Bet {
  id?: number,
  page_number?:number,
  offset?:number,
  customer_id?: string,
  statement_invoice?: string,
  invoice_no?: string,
  terms?: string,
  due_date?: string,
  message_invoice?: string,
  invoice_date?: string,
  estimate_date?: string,
  expiry_date?: string,
  estimate_message?: string,
  estimate_no?: string,
  statement_message?: string,
  filter_value?:any
}
