export default interface Item {
  id?:string,
  page_number?:number,
  page_size?:number,
  offset?:number,
  client_id?:number,
  item_name?: string,
  filter_value?:any
}
