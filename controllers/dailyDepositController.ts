import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import depositService from '../services/depositService.ts';



export default {

  /**
   * @description Get all Employee List
   */
  getAllDailyDeposit: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await depositService.getFilter({
          filter_value: filter_value
        });
        ctx.response.status = 200;
        ctx.response.body = data;

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  getDepositRequest: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getDespositRequests({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getDespositRequests({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        if (page_number == null) {
          page_number = "1"
        }
        console.log(filter_value, '||| params');
        const offset = (Number(page_number) - 1) * 10;
        const data = await depositService.getDespositFilter({
          offset: Number(offset),
          filter_value: filter_value
        });
        ctx.response.status = 200;
        ctx.response.body = data;

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  getPayStack: async (ctx: any) => {
    try {
      const data = await depositService.getPayStack();
      ctx.response.status = 200;
      ctx.response.body = data;

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  getMTNDepositRates: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getMTNDepositRates({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getMTNDepositRates({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await depositService.getMTNDepositRatesFilter({
          filter_value: filter_value
        });
        ctx.response.status = 200;
        ctx.response.body = data;

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },



  getCustomerWithdrawals: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getCustomerWidrawals({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getCustomerWidrawals({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const offset = (Number(page_number) - 1) * 10;
        const data = await depositService.getCustomerFilter({
          filter_value: filter_value,
          offset: Number(offset)
        });
        ctx.response.status = 200;
        ctx.response.body = data;

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  getTransaction: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getCustomerTransaction({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await depositService.getCustomerTransaction({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const offset = (Number(page_number) - 1) * 10;
        const data = await depositService.getTransactionFilter({
          filter_value: filter_value,
          offset: Number(offset)
        });
        ctx.response.status = 200;
        ctx.response.body = data;

      }

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  countMTNDeposits: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await depositService.getMTNRatesCount();
      ctx.response.status = 200;
      ctx.response.body = data;

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  getMTNDeposits: async (ctx: any) => {
    try {
      const data = await depositService.getMTNDeposit();
      ctx.response.status = 200;
      ctx.response.body = data;

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  getDailyIncome: async (ctx: any) => {
    try {
      const data = await depositService.getDailyIncome();
      ctx.response.status = 200;
      ctx.response.body = data;

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },
  getPayCodes: async (ctx: any) => {
    try {
      const data = await depositService.getPayCode();
      ctx.response.status = 200;
      ctx.response.body = data;

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },
  countIncome: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await depositService.getCounts();
      ctx.response.status = 200;
      ctx.response.body = data;

    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

};