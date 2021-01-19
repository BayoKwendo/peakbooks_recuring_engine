import customerServices from "../services/customerServices.ts";
import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";

await new Promise((resolve) => setTimeout(resolve, 0));


export default {
  /**
   * @description Add a new Customer
   */
  createCustomer: async ({ request, response }: { request: any; response: any },) => {
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

      await customerServices.createCustomer(
        {
          client_id: values.client_id,
          customer_type: values.customer_type,
          title: values.title,
          first_name: values.first_name,
          other_name: values.other_name,
          email: values.email,
          msisdn: values.msisdn,
          company_name: values.company_name,
          customer_display_name: values.customer_display_name,
          website: values.website
        }
      );
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
  createBilling: async ({ request, response }: { request: any; response: any },) => {
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

      const createMoreInfo = await customerServices.createAddress(
        {
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
          out_of_balance: values.out_of_balance
        }
      );

      if (createMoreInfo) {
        const updateCustomerStatus = await customerServices.updateCustomer(
          {
            customer_id: values.customer_id,
          }
        );
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
      let { page_number, filter_value, client_id } = getQuery(ctx, { mergeParams: true });
      const total = await customerServices.getPageSizeCustomer({
        client_id: client_id
      });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await customerServices.getAll({
            client_id: client_id,
            offset: Number(offset)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
                
          const data = await customerServices.getAll({
            client_id: client_id,
            offset: Number(offset)
          });

          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        }
      } else {
        // console.log(filter_value, '||| params');

        const data = await customerServices.getCustomerFilter({
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
   * @description Get One Customers List
   */
  getAllCustomersInfo: async (ctx: any) => {
    try {

      let { customer_id } = getQuery(ctx, { mergeParams: true });
      console.log(customer_id, '||| params');

      const data = await customerServices.getCustomerMore({
        customer_id: customer_id,
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
    * @description Get Update Customer
    */
  updateUserCustomer: async ({ request, response }: { request: any; response: any },) => {
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
      await customerServices.updateCustomerAll(
        {
          customer_id: values.customer_id,
          client_id: values.client_id,
          customer_type: values.customer_type,
          title: values.title,
          first_name: values.first_name,
          other_name: values.other_name,
          email: values.email,
          msisdn: values.msisdn,
          company_name: values.company_name,
          customer_display_name: values.customer_display_name,
          website: values.website
        },
      );
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
    * @description Get Update Customer More Info
    */
  updateUserCustomerMore: async ({ request, response }: { request: any; response: any },) => {
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

      const updateMoreInfo = await customerServices.updateCustomerMore(
        {
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
          out_of_balance: values.out_of_balance
        }
      );
      if (updateMoreInfo) {
        response.body = {
          status: true,
          status_code: 200,
          message: "Customer More Info Updated Successfully"
        };

      }
    }
    catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },


};