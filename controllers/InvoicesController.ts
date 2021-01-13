import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import invoiceService from '../services/invoiceService.ts';



export default {
  /**
* @description Add a new invoice
*/
  createInvoices: async ({ request, response }: { request: any; response: any },) => {
    const body = await request.body();
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      // 
      const body222 = await invoiceService.createInvoice(
        {
          customer_id: values.customer_id,
          invoice_no: values.invoice_no,
          terms: values.terms,
          due_date: values.due_date,
          invoice_date: values.invoice_date,
          message_invoice: values.message_invoice,
          statement_invoice: values.statement_invoice,
          amount: values.amount,
          estimate: values.estimate,
          due_amount: values.due_amount,
          discount_amount: values.discount_amount,
          sub_total: values.sub_total,
          tax_amount: values.tax_amount,
          created_by: values.created_by,
          recurring: values.recurring
        }
      );

      if (body222) {

        if (values.frequecy == null) {
          response.body = {
            status: true,
            status_code: 200,
            message: "Invoices added successfully",
          };
        } else {

          const recurring_invoices = await invoiceService.createRecurringInvoice(
            {
              invoice_no: values.invoice_no,
              start_time: values.start_time,
              due_amount: values.due_amount,
              end_time: values.end_time,
              frequecy: values.frequecy,
              frequency_type: values.frequency_type,
              customer_id: values.customer_id,
              created_by: values.created_by

            })

          if (recurring_invoices) {
            response.body = {
              status: true,
              status_code: 200,
              message: "Recurring Invoices added successfully",
            };
          }
        }
      }

    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },
  /**
   * @description Add a new invoice
   */
  createEstimates: async ({ request, response }: { request: any; response: any },) => {
    const body = await request.body();
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      await invoiceService.createEstimate(
        {
          customer_id: values.customer_id,
          estimate_no: values.estimate_no,
          expiry_date: values.expiry_date,
          estimate_date: values.estimate_date,
          estimate_message: values.estimate_message,
          statement_message: values.statement_message,
          amount: values.amount,
          due_amount: values.due_amount,
          discount_amount: values.discount_amount,
          sub_total: values.sub_total,
          tax_amount: values.tax_amount,
          created_by: values.created_by
        }
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Estimate added successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },



  updatefrequencystatus: async ({ request, response }: { request: any; response: any },) => {
    const body = await request.body();
    if (!request.hasBody) {
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      await invoiceService.updatefrequencystatus(
        {
          invoice_no: values.invoice_no,
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Updated Successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },

  updatefrequencystatus2: async ({ request, response }: { request: any; response: any },) => {
    const body = await request.body();
    if (!request.hasBody) {
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      await invoiceService.updatefrequencystatus2(
        {
          invoice_no: values.invoice_no,
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Updated Successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },

  updateInvoicePDF: async ({ request, response }: { request: any; response: any },) => {
    const body = await request.body();
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      await invoiceService.updateInvoice(
        {
          customer_id: values.customer_id,
          invoice_no: values.invoice_no,
          terms: values.terms,
          due_date: values.due_date,
          invoice_date: values.invoice_date,
          message_invoice: values.message_invoice,
          statement_invoice: values.statement_invoice,
          amount: values.amount,
          due_amount: values.due_amount,
          discount_amount: values.discount_amount,
          sub_total: values.sub_total,
          tax_amount: values.tax_amount,
          created_by: values.created_by
          // activation_key: values.activation_key
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Invoice Updated Successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },


  updateEstimatePDF: async ({ request, response }: { request: any; response: any },) => {
    const body = await request.body();
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      await invoiceService.updateEstimate(
        {
          customer_id: values.customer_id,
          estimate_no: values.estimate_no,
          expiry_date: values.expiry_date,
          estimate_date: values.estimate_date,
          estimate_message: values.estimate_message,
          statement_message: values.statement_message,
          amount: values.amount,
          due_amount: values.due_amount,
          discount_amount: values.discount_amount,
          sub_total: values.sub_total,
          tax_amount: values.tax_amount,
          created_by: values.created_by
          // activation_key: values.activation_key
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Estimate Updated Successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },


  convertEstimate: async ({ request, response }: { request: any; response: any },) => {
    const body = await request.body();
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      await invoiceService.convertEstimate(
        {
          invoice_no: values.invoice_no,
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: ` Success! Estimate#${values.invoice_no} has been converted to invoice`,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },



  /**
   * @description Get all rECURRING Invoices List
   */
  getFrequencyInvoices: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, estimate, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await invoiceService.getPageSizeFrequencyInvoice({
        created_by: Number(created_by),
        estimate: estimate
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getFrequencyInvoices({
            offset: Number(offset),
            estimate: estimate,
            created_by: Number(created_by)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getFrequencyInvoices({
            offset: Number(offset),
            estimate: estimate,
            created_by: Number(created_by)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        }
      }

      else {
        console.log(filter_value, '||| params');

        const data = await invoiceService.getFrequencyInvoicesFilter({
          filter_value: filter_value,

        });

        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  /**
 * @description Get all Invoices List
 */
  getOneInvoices: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, estimate, created_by } = getQuery(ctx, { mergeParams: true });

      page_number = "1"

      const offset = (Number(page_number) - 1) * 10;
      const data = await invoiceService.getOneInvoices({
        offset: Number(offset),
        estimate: estimate,
        created_by: Number(created_by)
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data
      };


    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },
  /**
  * @description Get all Invoices List
  */
  getInvoices: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, estimate, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await invoiceService.getPageSizeInvoice({
        created_by: Number(created_by),
        estimate: estimate
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getInvoices({
            offset: Number(offset),
            estimate: estimate,
            created_by: Number(created_by)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getInvoices({
            offset: Number(offset),
            estimate: estimate,
            created_by: Number(created_by)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        }
      }

      else {
        console.log(filter_value, '||| params');

        const data = await invoiceService.getInvoiceFilter({
          filter_value: filter_value,
          created_by:  Number(created_by)

        });

        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  /**
  * @description Get all Invoices List
  */
  getInvoicesUnpaid: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { filter_value, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await invoiceService.getPageSizeInvoiceUnpaid({
        filter_value: filter_value,
        created_by: Number(created_by),
      });

      console.log(filter_value, '||| params');

      const data = await invoiceService.getInvoiceFilterUnpaid({
        filter_value: filter_value,
        created_by: Number(created_by)

      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        total: total,
        data: data
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  /**
  * @description Get all Invoices List
  */
  getInvoicesPaidReceipt: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { filter_value } = getQuery(ctx, { mergeParams: true });
      const total = await invoiceService.getPageSizeInvoicePaidReceipt({
        filter_value: filter_value
      });

      console.log(filter_value, '||| params');

      const data = await invoiceService.getInvoiceFilterPaidReceipt({
        filter_value: filter_value
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        total: total,
        data: data
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  /**
* @description Get all Estimates List
*/
  getEstimates: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await invoiceService.getPageSizeEstimates({
        created_by: Number(created_by)
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getEstimates({
            offset: Number(offset),
            created_by: Number(created_by)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getEstimates({
            offset: Number(offset),
            created_by: Number(created_by),
          });

          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await invoiceService.getEstimateFilter({
          filter_value: filter_value
        });

        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  /**
* @description Get all Invoices item list
*/
  getInvoiceItem: async (ctx: any) => {
    try {
      let { filter_value } = getQuery(ctx, { mergeParams: true });
      const data = await invoiceService.getInvoiceItems({
        filter_value: filter_value,

      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data
      };

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },



  /**
* @description Get all Invoices item list
*/
  getEstimateItem: async (ctx: any) => {
    try {
      let { filter_value } = getQuery(ctx, { mergeParams: true });
      const data = await invoiceService.geteEstimateItems({
        filter_value: filter_value,

      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data
      };

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


};