import { getQuery } from "https://deno.land/x/oak/helpers.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import creditService from "../services/creditService.ts";

export default {
  /**
   * @description Add a new invoice
   */
  createCreditNote: async ({
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
      const body222 = await creditService.createCrediNote({
        customer_id: values.customer_id,
        credit_no: values.credit_no,
        credit_date: values.credit_date,
        customer_note: values.customer_note,
        terms_condition: values.terms_condition,
        amount: values.amount,
        due_amount: values.due_amount,
        discount_amount: values.discount_amount,
        sub_total: values.sub_total,
        tax_amount: values.tax_amount,
        created_by: values.created_by,
      });

      if (body222) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Credit Note added successfully",
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
   * @description Add a new Credit note vendor
   */
  createCreditNoteVendor: async ({
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
    if (!values.vendor_id) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please select a vendor",
      };
      return;
    }
    try {
      const values = await body.value;
      //
      const body222 = await creditService.createCrediNoteVendor({
        vendor_id: values.vendor_id,
        credit_no: values.credit_no,
        credit_date: values.credit_date,
        notes: values.notes,
        amount: values.amount,
        due_amount: values.due_amount,
        discount_amount: values.discount_amount,
        sub_total: values.sub_total,
        tax_amount: values.tax_amount,
        created_by: values.created_by,
      });

      if (body222) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Credit Note  Vendor added successfully",
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

  updateCreditNote: async ({
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
      //
      const body222 = await creditService.updatedCredit({
        customer_id: values.customer_id,
        credit_no: values.credit_no,
        credit_date: values.credit_date,
        customer_note: values.customer_note,
        terms_condition: values.terms_condition,
        amount: values.amount,
        due_amount: values.due_amount,
        discount_amount: values.discount_amount,
        sub_total: values.sub_total,
        tax_amount: values.tax_amount,
        created_by: values.created_by,
      });

      if (body222) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Credit Note added successfully",
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
  //   /**
  //  * @description Get all Invoices List
  //  */
  //   getOneInvoices: async (ctx: any) => {
  //     try {
  //       // let kw = request.url.searchParams.get('page_number');
  //       // console.log("bayo", kw)
  //       let { page_number, filter_value, estimate, created_by } = getQuery(ctx, { mergeParams: true });

  //       page_number = "1"

  //       const offset = (Number(page_number) - 1) * 10;
  //       const data = await invoiceService.getOneInvoices({
  //         offset: Number(offset),
  //         estimate: estimate,
  //         created_by: Number(created_by)
  //       });
  //       ctx.response.body = {
  //         status: true,
  //         status_code: 200,
  //         data: data
  //       };

  //     } catch (error) {
  //       ctx.response.status = 400;
  //       ctx.response.body = {
  //         success: false,
  //         message: `Error: ${error}`,
  //       };
  //     }
  //   },
  //   /**
  // * @description Get all Invoices List
  // */
  getCreditNote: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, created_by } = getQuery(ctx, {
        mergeParams: true,
      });
      const total = await creditService.getPageSizeCredit({
        created_by: Number(created_by),
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, "||| params");

        if (page_number == null) {
          page_number = "1";

          const offset = (Number(page_number) - 1) * 10;
          const data = await creditService.getCreditNote({
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
          const data = await creditService.getCreditNote({
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
        const data = await creditService.getCreditFilter({
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
   * @description Get all Payment Reports List
   */
  getCreditNoteReport: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let {
        page_number,
        page_size,
        startDate,
        endDate,
        created_by,
      } = getQuery(ctx, { mergeParams: true });

      const total = await creditService.getCreditNoteReportSize({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
      });
      if (page_number == null) {
        page_number = "1";
        page_size = "100";

        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await creditService.getCreditNoteReport({
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
        const data = await creditService.getCreditNoteReport({
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

  getCreditNoteVendor: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, created_by } = getQuery(ctx, {
        mergeParams: true,
      });
      const total = await creditService.getPageSizeVendorCredit({
        created_by: Number(created_by),
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, "||| params");

        if (page_number == null) {
          page_number = "1";

          const offset = (Number(page_number) - 1) * 10;
          const data = await creditService.getCreditVendorNote({
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
          const data = await creditService.getCreditVendorNote({
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
        const data = await creditService.getCreditVendorFilter({
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

  //   /**
  // * @description Get all credit item list
  // */
  getCreditVendorItems: async (ctx: any) => {
    try {
      let { filter_value } = getQuery(ctx, { mergeParams: true });
      const data = await creditService.getCreditVendorItems({
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

  //   /**
  // * @description Get all credit item list
  // */
  getCreditItem: async (ctx: any) => {
    try {
      let { filter_value } = getQuery(ctx, { mergeParams: true });
      const data = await creditService.getCreditItems({
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
