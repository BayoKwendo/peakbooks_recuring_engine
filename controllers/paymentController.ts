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
};