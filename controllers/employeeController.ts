import Employee from "../interfaces/Employee.ts";
import EmployeeService from "../services/employeeService.ts";
import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";

await new Promise((resolve) => setTimeout(resolve, 0));


export default {

  /**
   * @description Get all Employee List
   */
  getAllEmployees: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getAll({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await EmployeeService.getFilter({
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

  /**
   * @description Add a new Employee
   */
  createEmployee: async ({ request, response }: { request: any; response: any },) => {
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

      await EmployeeService.add(
        {
          mobile: values.mobile
        },
      );
      response.body = {
        success: true,
        message: "Phone Number was blacklisted successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },




  getBlackListed: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });

      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getAllBlackListed({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getAllBlackListed({
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await EmployeeService.getAllBlacKfILTER({
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
  /**
   * @description Get Employee by id
   */
  filterCustomers: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await EmployeeService.getFilter({
        filter_value: filter_value
      });
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


  // updateEmployeeById: async ({ params, request, response }: {
  //   params: { id: string };
  //   request: any;
  //   response: any;
  // },) => {
  //   try {
  //     const isAvailable = await EmployeeService.doesExistById(
  //       { id: Number(params.id) },
  //     );
  //     if (!isAvailable) {
  //       response.status = 404;
  //       response.body = {
  //         success: false,
  //         message: "No Employee found",
  //       };
  //       return;
  //     }
  //     const body = await request.body();
  //     const updatedRows = await EmployeeService.updateById({
  //       id: Number(params.id),
  //       ...body.value,
  //     });
  //     response.status = 200;
  //     response.body = {
  //       success: true,
  //       message: `Successfully updated ${updatedRows} row(s)`,
  //     };
  //   } catch (error) {
  //     response.status = 400;
  //     response.body = {
  //       success: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },

  countBound: async ({ params, request, response }: {
    params: { mobile: string };
    request: any;
    response: any;
  },) => {
    try {
      const isAvailable = await EmployeeService.getBoundCount(
        { mobile: Number(params.mobile) },
      );
    
      response.status = 200;
      response.body = isAvailable;

    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  countOutMsgs: async ({ params, request, response }: {
    params: { mobile: string };
    request: any;
    response: any;
  },) => {
    try {
      const isAvailable = await EmployeeService.getOutboundCount(
        { mobile: Number(params.mobile) },
      );
    
      response.status = 200;
      response.body = isAvailable;

    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },


  // countOutMsgs: async (ctx: any) => {
  //   try {
  //     const { filter_value } = getQuery(ctx, { mergeParams: true });
  //     console.log(filter_value, '||| params');
      
  //     const data = await EmployeeService.getOutboundCount();
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

  countBlackList: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await EmployeeService.getBlacklistCount();
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
  countCustomers: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await EmployeeService.getCounts();
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


  countBalance: async (ctx: any) => {
    try {
      const { filter_value } = getQuery(ctx, { mergeParams: true });
      console.log(filter_value, '||| params');
      const data = await EmployeeService.getCountsBalance();
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
  /**
   * @description Update Employee by id
   */
  updateEmployeeById: async ({ params, request, response }: {
    params: { id: string };
    request: any;
    response: any;
  },) => {
    try {
      const isAvailable = await EmployeeService.doesExistById(
        { id: Number(params.id) },
      );
      if (!isAvailable) {
        response.status = 404;
        response.body = {
          success: false,
          message: "No Employee found",
        };
        return;
      }
      const body = await request.body();
      const updatedRows = await EmployeeService.updateById({
        id: Number(params.id),
        ...body.value,
      });
      response.status = 200;
      response.body = {
        success: true,
        message: `Successfully updated ${updatedRows} row(s)`,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  /**
   * @description Delete Employee by id
   */
  deleteEmployeeById: async (
    { params, response }: { params: { mobile: string }; response: any },
  ) => {
    try {
      const updatedRows = await EmployeeService.deleteById({
        mobile: params.mobile,
      });
      response.status = 200;
      response.body = {
        status: true,
        message: `Customer was successfully removed from blacklist`,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `Error: ${error}`,
      };
    }
  },

  getCustomrByMobile: async (
    { params, response }: { params: { mobile: string }; response: any },) => {
    try {
      const isAvailable = await EmployeeService.getOnceCustomerPresent(
        { mobile: params.mobile },
      );
      if (!isAvailable) {
        response.status = 404;
        response.body = {
          status: false,
          message: "User Not found!!",
        };
      } else {
        const data = await EmployeeService.getOnceCustomer(
          { mobile: params.mobile },
        );
        response.status = 200;
        response.body = {
          status: true,
          data: data,
        };
      }


    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `Error: ${error}`,
      };
    }
  },

  getCustomrDetails: async (
    { params, response }: { params: { mobile: string }; response: any },) => {
    try {

      const data = await EmployeeService.getOnceCustomer(
        { mobile: params.mobile },
      );
      response.status = 200;
      response.body = data;

    } catch (error) {
      response.status = 400;
      response.body = {
        status: false,
        message: `Error: ${error}`,
      };
    }
  },


  getGames: async (ctx: any) => {
    try {
      let { mobile, page_number, filter_value } = getQuery(ctx, { mergeParams: true });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getGames({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getGames({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await EmployeeService.getGamesFilter({
          mobile: mobile,
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

  // getGames: async (
  //   { params, response }: { params: { mobile: string }; response: any },) => {
  //   try {

  //       const data  = await EmployeeService.getGames(
  //         { mobile: params.mobile },
  //       );
  //       response.status = 200;
  //       response.body = data;

  //   } catch (error) {
  //     response.status = 400;
  //     response.body = {
  //       status: false,
  //       message: `Error: ${error}`,
  //     };
  //   }
  // },

  getBound: async (ctx: any) => {
    try {
      let { mobile, page_number, filter_value } = getQuery(ctx, { mergeParams: true });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getBound({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getBound({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await EmployeeService.getBoundFilter({
          mobile: mobile,
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

  getInboundMessages: async (ctx: any) => {
    try {
      let { mobile, page_number, filter_value } = getQuery(ctx, { mergeParams: true });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getInboundMessages({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getInboundMessages({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await EmployeeService.getInboundMessages({
          mobile: mobile,
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


  getOutboundMessages: async (ctx: any) => {
    try {
      let { mobile, page_number, filter_value } = getQuery(ctx, { mergeParams: true });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getOutboundMessages({
            mobile: mobile,
            offset: Number(offset)
          });

          // const mcount = await EmployeeService.getOutboundCount({
          //   mobile: mobile,
          //   offset: Number(offset)
          // });
  
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getOutboundMessages({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await EmployeeService.getOutboundMessages({
          mobile: mobile,
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


  getCustomerLog: async (ctx: any) => {
    try {
      let { mobile, page_number, filter_value } = getQuery(ctx, { mergeParams: true });
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');
        if (page_number == null) {
          page_number = "1"
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getCustomerLog({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await EmployeeService.getCustomerLog({
            mobile: mobile,
            offset: Number(offset)
          });
          ctx.response.status = 200;
          ctx.response.body = data;
        }
      } else {
        const data = await EmployeeService.getCustomerFilter({
          mobile: mobile,
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