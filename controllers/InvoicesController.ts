import { getQuery } from "https://deno.land/x/oak/helpers.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import invoiceService from "../services/invoiceService.ts";

export default {
  /**
   * @description Add a new invoice
   */
  createInvoices: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
    const body = await request.body();
    const values = await body.value;
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    if (!values.customer_id) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please select a customer",
      };
      return;
    }

    try {
      const values = await body.value;
      //
      const body222 = await invoiceService.createInvoice({
        customer_id: values.customer_id,
        invoice_no: values.invoice_no,
        terms: values.terms,
        due_date: values.due_date,
        invoice_date: values.invoice_date,
        message_invoice: values.message_invoice,
        statement_invoice: values.statement_invoice,
        amount: values.amount,
        reference: values.reference,
        tax_exclusive: values.tax_exclusive,
        sales_person_id: values.sales_person_id,
        estimate: values.estimate,
        due_amount: values.due_amount,
        approved: values.approved,
        discount_amount: values.discount_amount,
        sub_total: values.sub_total,
        tax_amount: values.tax_amount,
        created_by: values.created_by,
        recurring: values.recurring,
      });


      console.log(values.approved);
      if (body222) {
        if (values.frequecy == null) {
          response.body = {
            status: true,
            status_code: 200,
            message:
              values.estimate == 0
                ? "Invoice added successfully"
                : "Quatation added successfully",
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
              created_by: values.created_by,
            }
          );

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



  createSalesPerson: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
    const body = await request.body();
    const values = await body.value;
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
      const body222 = await invoiceService.createSalesPerson({
        sales_person: values.sales_person,
        created_by: values.created_by
      });
      if (body222) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Successfully",
        };
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
  * @description Get all Sales Person
  */
  getSalesPerson: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { created_by } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getSalesPerson({
        created_by: Number(created_by),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
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
  deleteSalesPerson: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { id } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.deleteSalesPerson({
        id: Number(id),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        message: "Delete successfully",
        data: data,
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },



  //TAX RATES



  createTax: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
    const body = await request.body();
    const values = await body.value;
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
      const body222 = await invoiceService.createTaxRate({
        tax_name: values.tax_name,
        tax_value: values.tax_value,
        created_by: values.created_by
      });
      if (body222) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Added Successfully",
        };
      }

    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },

  //update tax

  updateTaxRates: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
    const body = await request.body();
    const values = await body.value;
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
      const body222 = await invoiceService.editTaxRate({
        tax_name: values.tax_name,
        tax_value: values.tax_value,
        id: values.id,
        created_by: values.created_by
      });
      if (body222) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Edited Successfully",
        };
      }

    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },



  //update invoices to send or not
  updateInvoiceSent: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
    const body = await request.body();
    const values = await body.value;
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
      const body222 = await invoiceService.updateInvoiceSent({
        filter_value: values.filter_value,
      });
      if (body222) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Updated Successfully",
        };
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
  * @description Get all Taxra
  */
  getTaxRates: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { created_by } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getTaxRates({
        created_by: Number(created_by),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
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
  deleteTaxRates: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { id } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.deleteTaxRates({
        id: Number(id),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        message: "Delete successfully",
        data: data,
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
  deleteInvoices: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { id, filter_value, created_by } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.deleteInvoices({
        id: Number(id),
      });


      if (data) {
        const total = await invoiceService.getInvoiceItemDelete({
          created_by: Number(created_by),
          filter_value: filter_value,
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          message: "Delete successfully",
        };

        if (total > 0) {
          for (let i = 0; i < total; i++) {
            if (total) {
              const data = await invoiceService.getInvoiceDeleteItems({
                created_by: Number(created_by),
                filter_value: filter_value
              });
              if (data) {
                // response.status = 200;
                // response.body = {
                //   status: true,
                //   status_code: 200,
                //   // message: "Client Account has been activated",
              };
            }
          }
        }
      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },



  // delete invoice item from

  getInvoiceDeleteItems: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { filter_value, created_by } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getInvoiceDeleteItems({
        created_by: Number(created_by),
        filter_value: filter_value
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        message: "Delete successfully",
        data: data,
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
   * @description Add a new invoice
   */
  createEstimates: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
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
      await invoiceService.createEstimate({
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
        created_by: values.created_by,
      });
      response.body = {
        status: true,
        status_code: 200,
        message: "Quotation added successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },

  updatefrequencystatus: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
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
      await invoiceService.updatefrequencystatus({
        invoice_no: values.invoice_no,
      });
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

  updatefrequencystatus2: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
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
      await invoiceService.updatefrequencystatus2({
        invoice_no: values.invoice_no,
        frequecy: values.frequecy,
        frequency_type: values.frequency_type
      });
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

  updateInvoicePDF: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
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
      await invoiceService.updateInvoice({
        customer_id: values.customer_id,
        invoice_no: values.invoice_no,
        terms: values.terms,
        due_date: values.due_date,
        invoice_date: values.invoice_date,
        message_invoice: values.message_invoice,
        statement_invoice: values.statement_invoice,
        amount: values.amount,
        approved: values.approved,
        due_amount: values.due_amount,
        discount_amount: values.discount_amount,
        sub_total: values.sub_total,
        tax_exclusive: values.tax_exclusive,
        tax_amount: values.tax_amount,
        created_by: values.created_by,
        // activation_key: values.activation_key
      });
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

  updateEstimatePDF: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
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
      await invoiceService.updateEstimate({
        customer_id: values.customer_id,
        invoice_no: values.invoice_no,
        terms: values.terms,
        due_date: values.due_date,
        invoice_date: values.invoice_date,
        message_invoice: values.message_invoice,
        statement_invoice: values.statement_invoice,
        amount: values.amount,
        approved: values.approved,
        due_amount: values.due_amount,
        discount_amount: values.discount_amount,
        sub_total: values.sub_total,
        tax_exclusive: values.tax_exclusive,
        tax_amount: values.tax_amount,
        created_by: values.created_by,
        // activation_key: values.activation_key
      });
      response.body = {
        status: true,
        status_code: 200,
        message: "Quotation Updated Successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },

  convertEstimate: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
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

      const total = await invoiceService.getInvoiceItemDelete({
        created_by: Number(values.created_by),
        filter_value: values.estimate_no,
      });

      console.log(values.estimate_no)

      const invoice_no = await invoiceService.getMaxmumInvoiceNo({
        created_by: values.created_by
      });
      if (invoice_no) {
        await invoiceService.convertEstimate({
          invoice_no: values.invoice_no,
          id: invoice_no
        });
        response.body = {
          status: true,
          status_code: 200,
          message: ` Success! Quotation#${values.invoice_no} has been converted to invoice`,
        };

        for (let i = 0; i < total; i++) {
          if (total) {

            await invoiceService.updateInvoiceItems({
              created_by: Number(values.created_by),
              filter_value: values.estimate_no,
              invoice_no: invoice_no
            });

          }
        }
      }

      // // if (total > 0) {

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
      let {
        page_number,
        filter_value,
        estimate,
        created_by,
        page_size,
      } = getQuery(ctx, { mergeParams: true });
      const total = await invoiceService.getPageSizeFrequencyInvoice({
        created_by: Number(created_by),
        estimate: estimate,
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, "||| params");

        if (page_number == null) {
          page_number = "1";

          page_size = "10";
          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getFrequencyInvoices({
            offset: Number(offset),
            estimate: estimate,
            page_size: Number(page_size),

            created_by: Number(created_by),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getFrequencyInvoices({
            offset: Number(offset),
            estimate: estimate,
            page_size: Number(page_size),

            created_by: Number(created_by),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        }
      } else {
        console.log(filter_value, "||| params");

        const data = await invoiceService.getFrequencyInvoicesFilter({
          filter_value: filter_value,
        });

        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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
      let { page_number, filter_value, estimate, created_by } = getQuery(ctx, {
        mergeParams: true,
      });

      page_number = "1";

      const offset = (Number(page_number) - 1) * 10;
      const data = await invoiceService.getOneInvoices({
        offset: Number(offset),
        estimate: estimate,
        created_by: Number(created_by),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },



  getInvoiceNo: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { created_by } = getQuery(ctx, {
        mergeParams: true,
      });

      const total = await invoiceService.getMaxmumInvoiceNo({
        created_by: Number(created_by)
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        totals: total
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },





  getSalesPersonReport: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let {
        page_number,
        page_size,
        startDate,
        endDate,
        created_by,
      } = getQuery(ctx, { mergeParams: true });

      const total = "0"
      // await invoiceService.getCustomerBalanceInvoiceSize({
      //   created_by: Number(created_by),
      //   startDate: startDate,
      //   endDate: endDate,
      // });

      // console.log(total)
      if (page_number == null) {
        page_number = "1";
        page_size = "100";

        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getSalesPersonReport({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
        };
      } else {
        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getSalesPersonReport({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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


  //Customer  Salves Report Controller
  getCustomerSales: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let {
        page_number,
        page_size,
        startDate,
        endDate,
        created_by,
      } = getQuery(ctx, { mergeParams: true });

      const total = await invoiceService.getCustomerBalanceInvoiceSize({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
      });

      // console.log(total)
      if (page_number == null) {
        page_number = "1";
        page_size = "100";

        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getCustomerSales({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
        };
      } else {
        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getCustomerSales({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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

  //Customer Balance Report Controller
  getCustomerBalanceInvoiceReport: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let {
        page_number,
        page_size,
        startDate,
        endDate,
        created_by,
      } = getQuery(ctx, { mergeParams: true });

      const total = await invoiceService.getCustomerBalanceInvoiceSize({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
      });

      console.log(total);
      if (page_number == null) {
        page_number = "1";
        page_size = "1000";

        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getCustomerBalanceInvoice({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
        };
      } else {
        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getCustomerBalanceInvoice({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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

  //Customer Aging Report Controller
  getAgingSummaryInvoice: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let {
        page_number,
        page_size,
        startDate,
        endDate,
        created_by,
      } = getQuery(ctx, { mergeParams: true });

      const total = await invoiceService.getAgingSummarySize({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
      });

      console.log(total);
      if (page_number == null) {
        page_number = "1";
        page_size = "1000";

        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getAgingSummaryInvoice({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
        };
      } else {
        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await invoiceService.getAgingSummaryInvoice({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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
  getInvoicesAmount: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let { created_by, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getInvoicesAmount({
        startDate: startDate,
        endDate: endDate,
        created_by: Number(created_by),
      });

      console.log(created_by);

      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
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
  getInvoicesAmountRatio: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let { created_by, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getInvoicesAmountRatio({
        startDate: startDate,
        endDate: endDate,
        created_by: Number(created_by),
      });

      console.log(created_by);

      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  getInvoicesTaxAmount: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let { created_by, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getInvoicesTaxAmount({
        startDate: startDate,
        endDate: endDate,
        created_by: Number(created_by),
      });

      console.log(created_by);

      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },



  getInvoicesCreditNoteVendorTax: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let { created_by, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getInvoicesCreditNoteVendorTax({
        startDate: startDate,
        endDate: endDate,
        created_by: Number(created_by),
      });

      console.log(created_by);

      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  getInvoicesCreditNoteTax: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let { created_by, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.getInvoicesCreditNoteTax({
        startDate: startDate,
        endDate: endDate,
        created_by: Number(created_by),
      });

      console.log(created_by);

      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
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
      let {

        filter_value,
        estimate,
        created_by,
        page_number,
        page_size,
        startDate,
        endDate,
      } = getQuery(ctx, { mergeParams: true });

      const total = await invoiceService.getPageSizeInvoice({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
        estimate: estimate,
      });
      if (filter_value == null || filter_value === "") {
        console.log(page_number, "||| params");

        if (page_number == null) {
          page_number = "1";
          page_size = "100";

          const offset = (Number(page_number) - 1) * Number(page_size);
          const data = await invoiceService.getInvoices({
            offset: Number(offset),
            estimate: estimate,
            startDate: startDate,
            page_size: Number(page_size),
            endDate: endDate,
            created_by: Number(created_by),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        } else {
          const offset = (Number(page_number) - 1) * Number(page_size);
          const data = await invoiceService.getInvoices({
            offset: Number(offset),
            estimate: estimate,
            startDate: startDate,
            endDate: endDate,
            page_size: Number(page_size),
            created_by: Number(created_by),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        }
      } else {
        console.log(filter_value, "||| params");

        console.log("bayo")
        const data = await invoiceService.getInvoiceFilter({
          filter_value: filter_value,
          created_by: Number(created_by),
        });

        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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


  getInvoiceFilterEstimate: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let {

        filter_value,
        estimate,
        created_by,
        page_number,
        page_size,
        startDate,
        endDate,
      } = getQuery(ctx, { mergeParams: true });

      console.log(filter_value, "||| params");

      console.log("bayo")
      const data = await invoiceService.getInvoiceFilterEstimate({
        filter_value: filter_value,
        created_by: Number(created_by),
      });

      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
      };

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  // receivable report

  /**
   * @description Get all receivable
   */
  getReceivableSummary: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let {
        page_number,
        page_size,
        startDate,
        endDate,
        filter_value,
        estimate,
        created_by,
      } = getQuery(ctx, { mergeParams: true });
      const total = await invoiceService.getReceivableSummarySize({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
        estimate: estimate,
      });

      if (page_number == null) {
        page_number = "1";
        page_size = "100";

        const offset = (Number(page_number) - 1) * 10;
        const data = await invoiceService.getReceivableSummary({
          offset: Number(offset),
          estimate: estimate,
          startDate: startDate,
          page_size: Number(page_size),
          endDate: endDate,
          created_by: Number(created_by),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
        };
      } else {
        const offset = (Number(page_number) - 1) * 10;
        const data = await invoiceService.getReceivableSummary({
          offset: Number(offset),
          estimate: estimate,
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
          created_by: Number(created_by),
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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

      console.log(filter_value, "||| params");

      const data = await invoiceService.getInvoiceFilterUnpaid({
        filter_value: filter_value,
        created_by: Number(created_by),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        total: total,
        data: data,
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
        filter_value: filter_value,
      });

      console.log(filter_value, "||| params");

      const data = await invoiceService.getInvoiceFilterPaidReceipt({
        filter_value: filter_value,
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        total: total,
        data: data,
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
      let { page_number, filter_value, created_by } = getQuery(ctx, {
        mergeParams: true,
      });
      const total = await invoiceService.getPageSizeEstimates({
        created_by: Number(created_by),
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, "||| params");

        if (page_number == null) {
          page_number = "1";

          const offset = (Number(page_number) - 1) * 10;
          const data = await invoiceService.getEstimates({
            offset: Number(offset),
            created_by: Number(created_by),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
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
            data: data,
          };
        }
      } else {
        console.log(filter_value, "||| params");

        const data = await invoiceService.getEstimateFilter({
          filter_value: filter_value,
        });

        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data,
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
  * @description Get Delete Recurring invoice
  */
  deleteRecurringInvoices: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { id } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await invoiceService.deleteRecurringInvoices({
        id: Number(id),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        message: "Delete successfully",
        data: data,
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
  getInvoiceItem: async (ctx: any) => {
    try {
      let { filter_value, client_id } = getQuery(ctx, { mergeParams: true });
      const data = await invoiceService.getInvoiceItems({
        filter_value: filter_value,
        created_by: Number(client_id),
      });
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: data,
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
        data: data,
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
