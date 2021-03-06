export default interface Item {
  id?: string,
  page_number?: number,
  page_size?: number,
  offset?: number,
  client_id?: number,
  item_name?: string,
  filter_value?: any,

  measurements?: string,

  reference?: string,
  notes?: string,
  investment_type?: string,
  amount?: string,
  vendor_id?: string,
  rate?: string,
  quantity?: string,
  startDate?: any,
  endDate?: any,
  created_by?: number
}
