import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import incomeService from '../services/incomeService.ts';



export default {

  /**
   * @description Get all Employee List
   */
  getAllDailyIncome: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await incomeService.getFilter({
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

  countIncome: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await incomeService.getCounts();
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




  getNLArchives: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getNLArchives({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getNLArchives({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await incomeService.getNLArchivesFilter({
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

  getWinLoss: async (ctx: any) => {
    try {
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getWinLoss({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getWinLoss({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await incomeService.getWinLoss({
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
  getStake: async (ctx: any) => {
    try {

      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getStake({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getStake({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await incomeService.getStake({
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
  getWallet: async (ctx: any) => {
    try {

      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getWallet({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await incomeService.getWallet({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        console.log(filter_value, '||| params');

        const data = await incomeService.getWallet({
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

};