import customerServices from "../services/customerServices.ts";
import { getQuery } from "https://deno.land/x/oak/helpers.ts";
import * as log from "https://deno.land/std/log/mod.ts";

await new Promise((resolve) => setTimeout(resolve, 0));

export default {
  /**
   * @description Add a new Customer
   */
  createCustomer: async ({
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
    // if (!values.customer_type) {
    //   response.status = 400;
    //   response.body = {
    //     success: false,
    //     message: "Please select customer type",
    //   };
    //   return;
    // }
    // if (!values.title) {
    //   response.status = 400;
    //   response.body = {
    //     success: false,
    //     message: "Please select title",
    //   };
    //   return;
    // }
    try {
      const values = await body.value;

      await customerServices.createCustomer({
        client_id: values.client_id,
        customer_type: values.customer_type,
        title: values.title,
        first_name: values.first_name,
        other_name: values.other_name,
        email: values.email,
        msisdn: values.msisdn,
        out_of_balance: values.out_of_balance,
        balance_open: values.out_of_balance,
        tax_info: values.tax_info,
        company_name: values.company_name,
        customer_display_name: values.customer_display_name,
        website: values.website,
      });
      response.body = {
        status: true,
        status_code: 200,
        message: "Customer has been created successfully",
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
   * @description Attach billing
   */
  createBilling: async ({
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

      const createMoreInfo = await customerServices.createAddress({
        customer_id: values.customer_id,
        city_town: values.city_town,
        state_province: values.state_province,
        country: values.country,
        street: values.street,
        street1: values.street1,
        city_town1: values.city_town1,
        state_province1: values.state_province1,
        country1: values.country1,
        notes: values.notes,
        tax_info: values.tax_info,
        payment_method: values.payment_method,
        delivery_method: values.delivery_method,
        terms: values.terms,
        out_of_balance: values.out_of_balance,
      });

      if (createMoreInfo) {
        const updateCustomerStatus = await customerServices.updateCustomer({
          customer_id: values.customer_id,
        });
        if (updateCustomerStatus) {
          response.body = {
            status: true,
            status_code: 200,
            message: "Successfully saved",
          };
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
   * @description Get all Customers List
   */
  getAllCustomers: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, page_size, client_id } = getQuery(ctx, {
        mergeParams: true,
      });
      const total = await customerServices.getPageSizeCustomer({
        client_id: client_id,
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, "||| params");

        if (page_number == null) {
          page_number = "1";
          page_size = "100";
          const offset = (Number(page_number) - 1) * Number(page_size);
          const data = await customerServices.getAll({
            client_id: client_id,
            page_size: Number(page_size),
            offset: Number(offset),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        } else {
          const offset = (Number(page_number) - 1) * Number(page_size);
          const data = await customerServices.getAll({
            client_id: client_id,
            page_size: Number(page_size),
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

        const data = await customerServices.getCustomerFilter({
          filter_value: filter_value,
          client_id: client_id
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

  getOneCustomersFilter: async (ctx: any) => {
    try {
      // console.log("bayo", kw)
      let { page_number, filter_value, page_size, client_id } = getQuery(ctx, {
        mergeParams: true,
      });
      // console.log(filter_value, '||| params');
      const data = await customerServices.getCustomerGetOne({
        filter_value: filter_value
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
   * @description Get One Customer balance
   */
  getCustomerBalanceRatio: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      console.log(client_id, "||| params");

      const data = await customerServices.getCustomerBalanceRatio({
        client_id: client_id,
        startDate: startDate,
        endDate: endDate,
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
   * @description Get One Customer balance
   */
  getAllCustomerBalance: async (ctx: any) => {
    try {
      let { client_id, startDate, endDate } = getQuery(ctx, {
        mergeParams: true,
      });
      console.log(client_id, "||| params");

      const data = await customerServices.getCustomerBalance({
        client_id: client_id,
        startDate: startDate,
        endDate: endDate,
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
   * @description Get One Customers List
   */
  getAllCustomersInfo: async (ctx: any) => {
    try {
      let { customer_id } = getQuery(ctx, { mergeParams: true });
      console.log(customer_id, "||| params");

      const data = await customerServices.getCustomerMore({
        customer_id: customer_id,
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
   * @description Get Update Customer
   */
  updateUserCustomer: async ({
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
      await customerServices.updateCustomerAll({
        customer_id: values.customer_id,
        client_id: values.client_id,
        customer_type: values.customer_type,
        title: values.title,
        first_name: values.first_name,
        other_name: values.other_name,
        email: values.email,
        tax_info: values.tax_info,
        out_of_balance: values.out_of_balance,
        msisdn: values.msisdn,
        company_name: values.company_name,
        customer_display_name: values.customer_display_name,
        website: values.website,
      });
      response.body = {
        status: true,
        status_code: 200,
        message: "Customer Updated Successfully",
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
   * @description Get Update Customer open balace
   */
  updateOutofBalance: async ({
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
      const update = await customerServices.updateOutofBalance({
        customer_id: values.customer_id,
        out_of_balance: values.out_of_balance
      });

      if (update) {
        const insert = await customerServices.insertOutofBalance({
          filter_value: values.payment_received_id,
          out_of_balance: values.out_of_balance,
          client_id: values.client_id,
          amount: values.amount
        });


        // const balance = Number(values.amount) - Number(values.out_of_balance);
        if (insert) {
          // alert(balance.toString())
          await customerServices.updatePaymentReceiveRecipt({
            filter_value: values.payment_received_id,
            out_of_balance: values.openbalance_received,
            amount: values.amount_2
          });


          console.log({

            filter_value: values.payment_received_id,
            out_of_balance: values.openbalance_received,
            amount: values.amount
          })


          response.body = {
            status: true,
            status_code: 200,
            message: "Customer Updated Successfully",
          };

        }
      }
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },





  /**
  * @description Delete customer
  */
  deleteCustomer: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { customer_id } = getQuery(ctx, {
        mergeParams: true,
      });
      const data = await customerServices.customerDelete({
        customer_id: customer_id,
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
   * @description Get Update Customer More Info
   */
  updateUserCustomerMore: async ({
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

      const updateMoreInfo = await customerServices.updateCustomerMore({
        customer_id: values.customer_id,
        city_town: values.city_town,
        state_province: values.state_province,
        country: values.country,
        street: values.street,
        street1: values.street1,
        city_town1: values.city_town1,
        state_province1: values.state_province1,
        country1: values.country1,
        notes: values.notes,
        tax_info: values.tax_info,
        payment_method: values.payment_method,
        delivery_method: values.delivery_method,
        terms: values.terms,
        out_of_balance: values.out_of_balance,
      });
      if (updateMoreInfo) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Customer More Info Updated Successfully",
        };
      }
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },
};
