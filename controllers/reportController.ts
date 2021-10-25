import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import reportService from '../services/reportService.ts';



export default {

  /**
   * @description Get all Employee List
   */
  getSummary: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await reportService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await reportService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await reportService.getFilter({
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

  getEod: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await reportService.getEod({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await reportService.getEod({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await reportService.getFilterEod({
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

  getCounts: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await reportService.getCounts();
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


  getCountEod: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await reportService.getCountEod();
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
  
  otherWinners: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await reportService.otherWinners();
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

  jackPots: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await reportService.getJackPots();
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

  average: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await reportService.avarageBet();
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

  countBetsPerDay: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await reportService.getCounts();
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


  // getPayStack: async (ctx: any) => {
  //   try {
  //     const data = await betService.getPayStack();
  //     ctx.response.status = 200;
  //     ctx.response.body = data;

  //   } catch (error) {
  //     ctx.response.status = 400;
  //     ctx.response.body = {
  //       success: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },

  // getMTNDepositRates: async (ctx: any) => {
  //   try {
  //     const data = await betService.getMTNDepositRates();
  //     ctx.response.status = 200;
  //     ctx.response.body = data;

  //   } catch (error) {
  //     ctx.response.status = 400;
  //     ctx.response.body = {
  //       success: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },


  // getMTNDeposits: async (ctx: any) => {
  //   try {
  //     const data = await betService.getMTNDeposit();
  //     ctx.response.status = 200;
  //     ctx.response.body = data;

  //   } catch (error) {
  //     ctx.response.status = 400;
  //     ctx.response.body = {
  //       success: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },

  // getDailyIncome: async (ctx: any) => {
  //   try {
  //     const data = await betService.getDailyIncome();
  //     ctx.response.status = 200;
  //     ctx.response.body = data;

  //   } catch (error) {
  //     ctx.response.status = 400;
  //     ctx.response.body = {
  //       success: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },
  // getPayCodes: async (ctx: any) => {
  //   try {
  //     const data = await betService.getPayCode();
  //     ctx.response.status = 200;
  //     ctx.response.body = data;

  //   } catch (error) {
  //     ctx.response.status = 400;
  //     ctx.response.body = {
  //       success: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },
  // countIncome: async (ctx: any) => {
  //   try {
  //     const { filter_value } = getQuery(ctx, { mergeParams: true });
  //     console.log(filter_value, '||| params');
  //     const data = await betService.getCounts();
  //     ctx.response.status = 200;
  //     ctx.response.body = data;

  //   } catch (error) {
  //     ctx.response.status = 400;
  //     ctx.response.body = {
  //       success: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },

};