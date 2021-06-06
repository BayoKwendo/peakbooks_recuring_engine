import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import itemService from '../services/itemService.ts';



export default {
  /**
* @description Add a new Item
*/
  createITEM: async ({ request, response }: { request: any; response: any },) => {
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
      const isAvailable = await itemService.itemExist(
        {
          item_name: values.item_name,
          client_id: values.client_id
        },
      );
      if (isAvailable) {
        response.status = 404;
        response.body = {
          Status: false,
          status_code: 400,
          message: `Item ${values.item_name} already exists.`,
        };
        return;
      }
      else {
        // const values = await body.value;
        await itemService.createITEM(
          {
            item_name: values.item_name,
            client_id: values.client_id,
            rate: values.rate,
            quantity: values.quantity

          }
        );
        response.body = {
          status: true,
          status_code: 200,
          message: `${values.item_name} added successfully to the List`,
        };
      }
    }
    catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `${error}`,
      };
    }
  },



  /**
* @description Add a new Item
*/
  addInvestment: async ({ request, response }: { request: any; response: any },) => {
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
      // const values = await body.value;
      await itemService.createInvestment(
        {
          investment_type: values.investment_type,
          amount: values.amount,
          client_id: values.client_id,

        }
      );
      response.body = {
        status: true,
        status_code: 200,
        message: `${values.investment_type} added successfully to the List`,
      };
    }
    catch (error) {
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
  getItems: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, page_size, client_id } = getQuery(ctx, { mergeParams: true });
      const total = await itemService.getPageSizeItem({
        client_id: Number(client_id),
      });
      console.log(filter_value, '||| params');





      if (filter_value == null || filter_value == "") {

        if (page_number == null) {
          page_number = "1";

          page_size = "100";

          const offset = (Number(page_number) - 1) * Number(page_size);

          const data = await itemService.getItems({
            offset: Number(offset),
            page_size: Number(page_size),
            client_id: Number(client_id)
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data
          };
        } else {
          const offset = (Number(page_number) - 1) * Number(page_size);
          const data = await itemService.getItems({
            offset: Number(offset),
            page_size: Number(page_size),
            client_id: Number(client_id)
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

        const data = await itemService.getItemFilter({
          filter_value: filter_value,
          client_id: Number(client_id)
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
* @description Get all Items List
*/
  getinvestment: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, page_size, client_id } = getQuery(ctx, { mergeParams: true });
      const total = await itemService.getPageSizeIvestment({
        client_id: Number(client_id),
      });
      console.log(page_size, '||| params');


      // if (filter_value == null || filter_value == "") {

      if (page_number == null) {
        page_number = "1";

        page_size = "10";

        const offset = (Number(page_number) - 1) * 10;

        const data = await itemService.getinvestment({
          offset: Number(offset),
          page_size: Number(page_size),
          client_id: Number(client_id)
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };
      } else {
        const offset = (Number(page_number) - 1) * 10;
        const data = await itemService.getinvestment({
          offset: Number(offset),
          page_size: Number(page_size),
          client_id: Number(client_id)
        });

        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };

        // } else {
        //   console.log(filter_value, '||| params');

        //   const data = await itemService.getItemFilter({
        //     filter_value: filter_value,
        //     client_id: Number(client_id)
        //   });

        //   ctx.response.body = {
        //     status: true,
        //     status_code: 200,
        //     total: total,
        //     data: data
        //   };

        // }
      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  updateItem: async ({ request, response }: { request: any; response: any },) => {
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
      await itemService.updateItem(
        {
          id: values.item_id,
          item_name: values.item_name,
          quantity: values.quantity,
          rate: values.rate,

          // activation_key: values.activation_key
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "Item Updated Successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },

  deleteItem: async (
    { params, response }: { params: { id: string }; response: any },) => {
    try {
      const isAvailable = await itemService.deleteItem(
        { id: params.id },
      );
      if (!isAvailable) {
        response.status = 404;
        response.body = {
          status: false,
          message: "Unable!!",
        };
      } else {
        const data = await itemService.deleteItem(
          { id: params.id },
        );
        response.status = 200;
        response.body = {
          status: true,
          status_code: 200,
          message: "Item has been deleted successfully",
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


  //Reports items purchase
  getItemPurchase: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let { page_number, page_size, startDate, endDate, created_by } = getQuery(ctx, { mergeParams: true });

      const total = await itemService.getItemPurchaseSize({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
      });

      console.log(total)
      if (page_number == null) {
        page_number = "1"
        page_size = "1000"

        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await itemService.getItemPurchase({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size)
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };
      } else {
        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await itemService.getItemPurchase({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size)
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

  //Reports items
  getItemSales: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      let { page_number, page_size, startDate, endDate, created_by } = getQuery(ctx, { mergeParams: true });

      const total = await itemService.getItemSalesSize({
        created_by: Number(created_by),
        startDate: startDate,
        endDate: endDate,
      });

      console.log(total)
      if (page_number == null) {
        page_number = "1"
        page_size = "1000"

        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await itemService.getItemSales({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size)
        });
        ctx.response.body = {
          status: true,
          status_code: 200,
          total: total,
          data: data
        };
      } else {
        const offset = (Number(page_number) - 1) * Number(page_size);
        const data = await itemService.getItemSales({
          offset: Number(offset),
          created_by: Number(created_by),
          startDate: startDate,
          endDate: endDate,
          page_size: Number(page_size)
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