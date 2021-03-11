import vendorService from "../services/vendorService.ts";
import { getQuery } from "https://deno.land/x/oak/helpers.ts";
import * as log from "https://deno.land/std/log/mod.ts";

await new Promise((resolve) => setTimeout(resolve, 0));

export default {
  /**
   * @description Add a new vendor
   */
  createVendor: async ({
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
      await vendorService.createVendor({
        client_id: values.client_id,
        title: values.title,
        first_name: values.first_name,
        other_name: values.other_name,
        email: values.email,
        msisdn: values.msisdn,
        company_name: values.company_name,
        vendor_display_name: values.vendor_display_name,
        website: values.website,
        city_town: values.city_town,
        state_province: values.state_province,
        country: values.country,
        street: values.street,
        street1: values.street1,
        city_town1: values.city_town1,
        state_province1: values.state_province1,
        country1: values.country1,
        remarks: values.remarks,
        terms: values.terms,
        opening_balance: values.opening_balance,
      });
      response.body = {
        status: true,
        status_code: 200,
        message: "Vendor has been created successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },

  //   /**
  //   * @description Attach billing
  //   */
  //   createBilling: async ({ request, response }: { request: any; response: any },) => {
  //     const body = await request.body();
  //     if (!request.hasBody) {
  //       response.status = 400;
  //       response.body = {
  //         success: false,
  //         message: "No data provided",
  //       };
  //       return;
  //     }
  //     try {
  //       const values = await body.value;

  //       const createMoreInfo = await customerServices.createAddress(
  //         {
  //           customer_id: values.customer_id,
  //           city_town: values.city_town,
  //           state_province: values.state_province,
  //           country: values.country,
  //           street: values.street,
  //           street1: values.street1,
  //           city_town1: values.city_town1,
  //           state_province1: values.state_province1,
  //           country1: values.country1,
  //           notes: values.notes,
  //           tax_info: values.tax_info,
  //           payment_method: values.payment_method,
  //           delivery_method: values.delivery_method,
  //           terms: values.terms,
  //           out_of_balance: values.out_of_balance
  //         }
  //       );

  //       if (createMoreInfo) {
  //         const updateCustomerStatus = await customerServices.updateCustomer(
  //           {
  //             customer_id: values.customer_id,
  //           }
  //         );
  //         if (updateCustomerStatus) {
  //           response.body = {
  //             status: true,
  //             status_code: 200,
  //             message: "Successfully saved",
  //           };

  //         }

  //       }

  //     } catch (error) {
  //       response.status = 400;
  //       response.body = {
  //         status: false,
  //         message: `${error}`,
  //       };
  //     }
  //   },

  /**
   * Update vendor
   */
  updateVendor: async ({
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
    }
    try {
      const values = await body.value;
      await vendorService.updateVendor({
        id: values.id,
        client_id: values.client_id,
        title: values.title,
        first_name: values.first_name,
        other_name: values.other_name,
        msisdn: values.msisdn,
        email: values.email,
        company_name: values.company_name,
        vendor_display_name: values.vendor_display_name,
        website: values.website,
        street: values.street,
        city_town: values.city_town,
        state_province: values.state_province,
        country: values.country,
        street1: values.street1,
        city_town1: values.city_town1,
        state_province1: values.state_province1,
        country1: values.country1,
        remarks: values.remarks,
        terms: values.terms,
        opening_balance: values.opening_balance,
      });
      response.body = {
        status: true,
        status_code: 200,
        message: "Vendor Updated Successfully",
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
   * @description Get all Vendors List
   */
  getAllVendors: async (ctx: any) => {
    try {
      let { page_number, filter_value, client_id } = getQuery(ctx, {
        mergeParams: true,
      });
      const total = await vendorService.getPageSizeVendor({
        client_id: client_id,
      });
      if (filter_value == null || filter_value == "") {
        if (page_number == null) {
          page_number = "1";
          const offset = (Number(page_number) - 1) * 10;
          const data = await vendorService.getAll({
            client_id: client_id,
            offset: Number(offset),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;

          const data = await vendorService.getAll({
            client_id: client_id,
            offset: Number(offset),
          });

          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        }
      } else {
        // console.log(filter_value, '||| params');

        const data = await vendorService.getVendorFilter({
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
   * @description Add a new vendor
   */
  createExpense: async ({
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
      const body222 = await vendorService.createExpense({
        client_id: values.client_id,
        date: values.date,
        expense_account: values.expense_account,
        amount: values.amount,
        paid_through: values.paid_through,
        tax_amount: values.tax_amount,
        vendor_id: values.vendor_id,
        notes: values.notes,
        billable: values.billable,
        product_name: values.product_name,
        start_time: values.start_time,
        end_time: values.end_time,
        frequecy: values.frequecy,
        frequency_type: values.frequency_type,
        customer_id: values.customer_id,
        created_by: values.client_id,
      });
      if (body222) {
        if (values.frequecy == null) {
          response.body = {
            status: true,
            status_code: 200,
            message: "Expense added successfully",
          };
        } else {
          const recurring_invoices = await vendorService.createRecurringExpense(
            {
              start_time: values.start_time,
              end_time: values.end_time,
              vendor_id: values.vendor_id,
              frequecy: values.frequecy,
              frequency_type: values.frequency_type,
              customer_id: values.customer_id,
              created_by: values.client_id,
            }
          );

          if (recurring_invoices) {
            response.body = {
              status: true,
              status_code: 200,
              message: "Recurring Expenses added successfully",
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

  updatefrequencyexpensestatus: async ({
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
      await vendorService.updatefrequencyexpensestatus({
        expense_ref: values.expense_ref,
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

  getExpenseReport: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getExpenseReport({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getVendorBalance: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getVendorBalance({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getTaxpayable: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getTaxpayable({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getReimbursements: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getReimbursements({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getTaxpayablePaid: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getTaxpayablePaid({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getFurnitureandEquipment: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getFurnitureandEquipment({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getTaxAmountTaxExpense: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getTaxAmountTaxExpense({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getEmployeeAdvanceExpense: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getEmployeeAdvanceExpense({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getFurnitureandEquipmentCredit: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getFurnitureandEquipmentCredit({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getPrepaidExpensesDebit: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getPrepaidExpensesDebit({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getReimbursementsCredit: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getReimbursementsCredit({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getAdvanceTaxPaid: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getAdvanceTaxPaid({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getUndepositedFunds: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getUndepositedFunds({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getPettyCash: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getPettyCash({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getPrepaidExpense: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getPrepaidExpenses({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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
  getEmployeeAdvance: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getEmployeeAdvance({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getAdvanceTax: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getAdvanceTax({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  getExpenseReportExpenseCost: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await vendorService.getExpenseReportExpenseCost({
        startDate: startDate,
        endDate: endDate,
        client_id: client_id,
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

  updatefrequencyexpensestatus2: async ({
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
      await vendorService.updatefrequencyexpensestatus2({
        expense_ref: values.expense_ref,
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

  /**
   * @description Get all Expenses List
   */
  getAllExpenses: async (ctx: any) => {
    try {
      let { page_number, filter_value, client_id } = getQuery(ctx, {
        mergeParams: true,
      });
      const total = await vendorService.getPageSizeExpense({
        client_id: client_id,
      });
      if (filter_value == null || filter_value == "") {
        if (page_number == null) {
          page_number = "1";
          const offset = (Number(page_number) - 1) * 10;
          const data = await vendorService.getExpenses({
            client_id: client_id,
            offset: Number(offset),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;

          const data = await vendorService.getExpenses({
            client_id: client_id,
            offset: Number(offset),
          });

          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        }
      } else {
        // console.log(filter_value, '||| params');

        const data = await vendorService.getExpenseFilter({
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
   * @description Get all Expenses List
   */
  getAllExpensesRecuring: async (ctx: any) => {
    try {
      let { page_number, filter_value, client_id } = getQuery(ctx, {
        mergeParams: true,
      });
      const total = await vendorService.getPageSizeExpenseRe({
        client_id: client_id,
      });
      if (filter_value == null || filter_value == "") {
        if (page_number == null) {
          page_number = "1";
          const offset = (Number(page_number) - 1) * 10;
          const data = await vendorService.getRecurringExpenses({
            client_id: client_id,
            offset: Number(offset),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;

          const data = await vendorService.getRecurringExpenses({
            client_id: client_id,
            offset: Number(offset),
          });

          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        }
      } else {
        // console.log(filter_value, '||| params');

        const data = await vendorService.getRecurringExpenses({
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
* @description Sales by vendor
*/
  getVendorSales: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, page_size, startDate, endDate, filter_value, created_by } = getQuery(ctx, { mergeParams: true });

      const total = await vendorService.getVendorSalesSize({
        created_by: created_by,
        startDate: startDate,
        endDate: endDate
      });



      if (page_number == null) {
        page_number = "1"
        page_size = "100"
        const offset = (Number(page_number) - 1) * 10;
        const data = await vendorService.getVendorSales({
          offset: Number(offset),
          startDate: startDate,
          page_size: Number(page_size),
          endDate: endDate,
          created_by: created_by
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };
      } else {
        const offset = (Number(page_number) - 1) * 10;
        const data = await vendorService.getVendorSales({
          offset: Number(offset),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
          created_by: created_by
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
* @description Get all payaable
*/
  getPayableSummary: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, page_size, startDate, endDate, filter_value, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await vendorService.getPayableSummarySize({
        created_by: created_by,
        startDate: startDate,
        endDate: endDate
      });

      if (page_number == null) {
        page_number = "1"
        page_size = "100"
        const offset = (Number(page_number) - 1) * 10;
        const data = await vendorService.getPayableSummary({
          offset: Number(offset),
          startDate: startDate,
          page_size: Number(page_size),
          endDate: endDate,
          created_by: created_by
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };
      } else {
        const offset = (Number(page_number) - 1) * 10;
        const data = await vendorService.getPayableSummary({
          offset: Number(offset),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
          created_by: created_by
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
* @description Get all receivable
*/
  getVendorBalanceBills: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, page_size, startDate, endDate, filter_value, created_by } = getQuery(ctx, { mergeParams: true });
      const total = await vendorService.getVendorBalanceBillsSize({
        created_by: created_by,
        startDate: startDate,
        endDate: endDate
      });

      if (page_number == null) {
        page_number = "1"
        page_size = "100"
        const offset = (Number(page_number) - 1) * 10;
        const data = await vendorService.getVendorBalanceBills({
          offset: Number(offset),
          startDate: startDate,
          page_size: Number(page_size),
          endDate: endDate,
          created_by: created_by
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };
      } else {
        const offset = (Number(page_number) - 1) * 10;
        const data = await vendorService.getVendorBalanceBills({
          offset: Number(offset),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size),
          created_by: created_by
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

  //   /**
  //    * @description Get One Customers List
  //    */
  //   getAllCustomersInfo: async (ctx: any) => {
  //     try {

  //       let { customer_id } = getQuery(ctx, { mergeParams: true });
  //       console.log(customer_id, '||| params');

  //       const data = await customerServices.getCustomerMore({
  //         customer_id: customer_id,
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
  //     * @description Get Update Customer
  //     */
  //   updateUserCustomer: async ({ request, response }: { request: any; response: any },) => {
  //     const body = await request.body();
  //     if (!request.hasBody) {
  //       response.status = 400;
  //       response.body = {
  //         success: false,
  //         message: "No data provided",
  //       };
  //       return;
  //     }
  //     try {
  //       const values = await body.value;
  //       await customerServices.updateCustomerAll(
  //         {
  //           customer_id: values.customer_id,
  //           client_id: values.client_id,
  //           customer_type: values.customer_type,
  //           title: values.title,
  //           first_name: values.first_name,
  //           other_name: values.other_name,
  //           email: values.email,
  //           msisdn: values.msisdn,
  //           company_name: values.company_name,
  //           customer_display_name: values.customer_display_name,
  //           website: values.website
  //         },
  //       );
  //       response.body = {
  //         status: true,
  //         status_code: 200,
  //         message: "Customer Updated Successfully",
  //       };
  //     } catch (error) {
  //       response.status = 400;
  //       response.body = {
  //         success: false,
  //         message: `${error}`,
  //       };
  //     }
  //   },

  //   /**
  //     * @description Get Update Customer More Info
  //     */
  //   updateUserCustomerMore: async ({ request, response }: { request: any; response: any },) => {
  //     const body = await request.body();
  //     if (!request.hasBody) {
  //       response.status = 400;
  //       response.body = {
  //         success: false,
  //         message: "No data provided",
  //       };
  //       return;
  //     }
  //     try {
  //       const values = await body.value;

  //       const updateMoreInfo = await customerServices.updateCustomerMore(
  //         {
  //           customer_id: values.customer_id,
  //           city_town: values.city_town,
  //           state_province: values.state_province,
  //           country: values.country,
  //           street: values.street,
  //           street1: values.street1,
  //           city_town1: values.city_town1,
  //           state_province1: values.state_province1,
  //           country1: values.country1,
  //           notes: values.notes,
  //           tax_info: values.tax_info,
  //           payment_method: values.payment_method,
  //           delivery_method: values.delivery_method,
  //           terms: values.terms,
  //           out_of_balance: values.out_of_balance
  //         }
  //       );
  //       if (updateMoreInfo) {
  //         response.body = {
  //           status: true,
  //           status_code: 200,
  //           message: "Customer More Info Updated Successfully"
  //         };

  //       }
  //     }
  //     catch (error) {
  //       response.status = 400;
  //       response.body = {
  //         success: false,
  //         message: `${error}`,
  //       };
  //     }
  //   },
};
