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

            await invoiceService.createInvoice(
                {
                    customer_id: values.customer_id,
                    invoice_no: values.invoice_no,
                    terms: values.terms,
                    due_date: values.due_date,
                    invoice_date: values.invoice_date,
                    message_invoice: values.message_invoice,
                    statement_invoice: values.statement_invoice
                }
            );
            response.body = {
                status: true,
                status_code: 200,
                message: "Invoices added successfully",
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
                statement_message: values.statement_message
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




//      /**
//    * @description Get all Employee List
//    */
//   getInvoice: async (ctx: any) => {
//     try {
//       // let kw = request.url.searchParams.get('page_number');
//       // console.log("bayo", kw)
//       let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

//       if (filter_value == null || filter_value == "") {
//         console.log(page_number, '||| params');

//         if (page_number == null) {
//           page_number = "1"

//           const offset = (Number(page_number) - 1) * 10;
//           const data = await customerServices.getAll({
//             offset: Number(offset)
//           });
//           ctx.response.status = 200;
//           ctx.response.body = data;
//         } else {
//           const offset = (Number(page_number) - 1) * 10;
//           const data = await customerServices.getAll({
//             offset: Number(offset)
//           });
//           ctx.response.status = 200;
//           ctx.response.body = data;
//         }
//       } else {
//         console.log(filter_value, '||| params');

//         const data = await customerServices.getAll({
//           filter_value: filter_value
//         });
//         ctx.response.status = 200;
//         ctx.response.body = data;

//       }

//     } catch (error) {
//       ctx.response.status = 400;
//       ctx.response.body = {
//         success: false,
//         message: `Error: ${error}`,
//       };
//     }

};