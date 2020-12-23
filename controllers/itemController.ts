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
      await itemService.createITEM(
        {
          item_name: values.item_name,
          client_id: values.client_id,

        }
      );
      response.body = {
        status: true,
        status_code: 200,
        message: `${values.item_name} added successfully to the List`,
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
  getItems: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value, page_size, client_id } = getQuery(ctx, { mergeParams: true });
      const total = await itemService.getPageSizeItem({
        client_id: Number(client_id),
      });
      console.log(page_size, '||| params');
      
     
      if (filter_value == null || filter_value == "") {

        if (page_number == null) {
          page_number = "1";
          
          page_size = "10";

          const offset = (Number(page_number) - 1) * 10;
        
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
          const offset = (Number(page_number) - 1) * 10;
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
  
};