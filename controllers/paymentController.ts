import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import paymentService from '../services/paymentService.ts';



export default {
  /**
* @description Add a new Item
*/
  createPaymentMethod: async ({ request, response }: { request: any; response: any },) => {
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
      await paymentService.createPayment(
        {
          name: values.name,
          client_id: values.client_id,

        }
      );
      response.body = {
        status: true,
        status_code: 200,
        message: `${values.name} added successfully to the List`,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },

  /**
* @description Get all Items List
*/
  getPayments: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, page_size, client_id } = getQuery(ctx, { mergeParams: true });
      // const total = await itemService.getPageSizeItem({
      //   client_id: Number(client_id),
      // });
      console.log(page_size, '||| params');


      if (filter_value == null || filter_value == "") {

        if (page_number == null) {
          page_number = "1";

          page_size = "10";

          const offset = (Number(page_number) - 1) * 10;

          const data = await paymentService.getPayment({
            offset: Number(offset),
            page_size: Number(page_size),
            client_id: Number(client_id)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            data: data
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await paymentService.getPayment({
            offset: Number(offset),
            page_size: Number(page_size),
            client_id: Number(client_id)
          });

          ctx.response.body = {
            status: true,
            status_code: 200,
            // total: total,
            data: data
          };
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await paymentService.getPaymentFilter({
          filter_value: filter_value,
          client_id: Number(client_id)
        });

        ctx.response.body = {
          status: true,
          status_code: 200,
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
* @description Add a new Item
*/
  createDeposit_to: async ({ request, response }: { request: any; response: any },) => {
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
      await paymentService.createDeposit_to(
        {
          name: values.name,
          client_id: values.client_id,

        }
      );
      response.body = {
        status: true,
        status_code: 200,
        message: `${values.name} added successfully to the List`,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },

  /**
  * @description Get all Items List
  */
  getDeposit_to: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, page_size, client_id } = getQuery(ctx, { mergeParams: true });
      // const total = await itemService.getPageSizeItem({
      //   client_id: Number(client_id),
      // });
      console.log(page_size, '||| params');


      if (filter_value == null || filter_value == "") {

        if (page_number == null) {
          page_number = "1";

          page_size = "10";

          const offset = (Number(page_number) - 1) * 10;

          const data = await paymentService.getDeposit_to({
            offset: Number(offset),
            page_size: Number(page_size),
            client_id: Number(client_id)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            data: data
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await paymentService.getDeposit_to({
            offset: Number(offset),
            page_size: Number(page_size),
            client_id: Number(client_id)
          });

          ctx.response.body = {
            status: true,
            status_code: 200,
            // total: total,
            data: data
          };
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await paymentService.getDeposittoFilter({
          filter_value: filter_value,
          client_id: Number(client_id)
        });

        ctx.response.body = {
          status: true,
          status_code: 200,
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
   * @description Add a new payment received
   */
  createPaymentReceivedPay: async ({ request, response }: { request: any; response: any },) => {
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

      await paymentService.createPaymentReceived(
        {
          customer_id: values.customer_id,
          invoice_no: values.invoice_no,
          amount_received: values.amount_received,
          payment_date: values.payment_date,
          payment_mode: values.payment_mode,
          reference: values.reference,
          deposit_to: values.deposit_to,
          notes: values.notes,
          amount_inexcess: values.amount_inexcess
        }
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Payment recorded successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },



  /**
 * @description Get all id payment rreceived
 */
  getPaymentUnpaidrecord: async (ctx: any) => {
    try {
      let { customer_id } = getQuery(ctx, { mergeParams: true });

      const data = await paymentService.getPaymentUnpaidrecord({
        customer_id: customer_id
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
 * @description Get all id payment rreceived
 */
  getPaymentUnpaidrecordbill: async (ctx: any) => {
    try {
      let { vendor_id } = getQuery(ctx, { mergeParams: true });

      const data = await paymentService.getPaymentUnpaidrecordbill({
        vendor_id: vendor_id
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


  updatePaymentBillUnpaidrecord: async ({ request, response }: { request: any; response: any },) => {
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
      await paymentService.updatePaymentBillUnpaidrecord(
        {
          vendor_id: values.vendor_id,
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Bill Payment was succesfully recorded",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },

  updatePaymentUnpaidrecord: async ({ request, response }: { request: any; response: any },) => {
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
      await paymentService.updatePaymentUnpaidrecord(
        {
          customer_id: values.customer_id,
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Payment was succesfully recorded",
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
  * @description Get all Payment made List
  */
  getPaymentReceivedPaid: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await paymentService.getPageSizePaymentReceived({
        created_by: Number(created_by),
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await paymentService.getPaymentReceivedUnpaid({
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
          const data = await paymentService.getPaymentReceivedUnpaid({
            offset: Number(offset),
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

        const data = await paymentService.getReceivedFilter({
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
  * @description Get all Payment made List FOR BILLS
  */
  getPaymentReceivedPaidbILLS: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await paymentService.getPageSizePaymentReceivedBills({
        created_by: Number(created_by),
      });
      console.log(created_by, '||| params');

      if (filter_value == null || filter_value == "") {

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await paymentService.getPaymentReceivedpaidbills({
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
          const data = await paymentService.getPaymentReceivedpaidbills({
            offset: Number(offset),
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
        const data = await paymentService.getReceivedFilterBills({
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
* @description Add a new bill
*/
  createBill: async ({ request, response }: { request: any; response: any },) => {
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
      const body222 = await paymentService.createBill(
        {
          vendor_id: values.vendor_id,
          bill_no: values.bill_no,
          terms: values.terms,
          bill_date: values.bill_date,
          due_date: values.due_date,
          notes: values.notes,
          tax_inclusive: values.tax_inclusive,
          amount: values.amount,
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
            message: "Bill added successfully",
          };
        } else {

          const recurring_invoices = await paymentService.createRecurringBill(
            {
              bill_no: values.bill_no,
              start_time: values.start_time,
              due_amount: values.due_amount,
              end_time: values.end_time,
              frequecy: values.frequecy,
              frequency_type: values.frequency_type,
              vendor_id: values.vendor_id,
              created_by: values.created_by

            })

          if (recurring_invoices) {
            response.body = {
              status: true,
              status_code: 200,
              message: "Recurring Bill added successfully",
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
  * @description Get all Invoices List
  */
  getBills: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, estimate, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await paymentService.getPageSizeBill({
        created_by: Number(created_by),
        estimate: estimate
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await paymentService.getBill({
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
          const data = await paymentService.getBill({
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

        const data = await paymentService.getInvoiceFilter({
          filter_value: filter_value,
          created_by: Number(created_by)

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
   * @description Get all rECURRING Invoices List
   */
  getFrequencyBills: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, estimate, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await paymentService.getPageSizeFrequencyBills({
        created_by: Number(created_by),
        estimate: estimate
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await paymentService.getFrequencyBills({
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
          const data = await paymentService.getFrequencyBills({
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

        const data = await paymentService.getFrequencyBillsFilter({
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
    * @description Get all unpaid bill List
    */
  getBillUnpaid: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { filter_value, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await paymentService.getPageSizeBillUnpaid({
        filter_value: filter_value,
        created_by: Number(created_by),
      });

      console.log(filter_value, '||| params');

      const data = await paymentService.getFilterBillsUnpaid({
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
    * @description Get all unpaid bill List
    */
  getBillingsAmount: async (ctx: any) => {
    try {

      let { created_by, startDate, endDate } = getQuery(ctx, { mergeParams: true });

      const data = await paymentService.getBillingsAmount({
        startDate: startDate,
        endDate: endDate,
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

  getPaymentReceivable: async (ctx: any) => {
    try {

      let { created_by, startDate, endDate } = getQuery(ctx, { mergeParams: true });

      const data = await paymentService.getPaymentReceivable({
        startDate: startDate,
        endDate: endDate,
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
     * @description Add a new payment received
     */
  createPaymentReceivedBillPay: async ({ request, response }: { request: any; response: any },) => {
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

      await paymentService.createPaymentReceivedBill(
        {
          vendor_id: values.vendor_id,
          bill_no: values.bill_no,
          order_no: values.order_no,
          amount_received: values.amount_received,
          payment_date: values.payment_date,
          payment_mode: values.payment_mode,
          reference: values.reference,
          deposit_to: values.deposit_to,
          notes: values.notes,
          amount_inexcess: values.amount_inexcess
        }
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Payment recorded successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },


};