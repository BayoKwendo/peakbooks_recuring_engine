import { Status } from 'https://deno.land/x/oak/mod.ts';
import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import userService from '../services/userService.ts';
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.0/mod.ts"
// import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt@v0.9.0/create.ts";
import clientemail from "../db/clientemail.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";


// const header: Jose = ;

const key = "dkdjdddhdhhdhwheruncdfhfhfhdd"
export default {
  /**
   * @description Get all Employee List
   */
  loginUser: async (ctx: any) => {
    const body = await ctx.request.body();
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: false,
        message: "No data provided",
      };
      return;
    }
    try {
      const values = await body.value;
      const hashedPassword = await bcrypt.hash(values.password);

      const isAvailable = await userService.loginUser(
        { email: values.email },
      );
      if (!isAvailable) {
        ctx.response.status = 404;
        ctx.response.body = {
          status: false,
          status_code: 400,
          message: "Email not found",
        };
        return;
      }

      else {
        const result = await bcrypt.compare(values.password, isAvailable.password);
        if (result) {
          const checkActive = await userService.checkActive(
            { email: values.email },
          );
          if (!checkActive) {
            ctx.response.status = 400;
            ctx.response.body = {
              status: false,
              status_code: 400,
              message: "Your Account is not activated!! Contact Administrators",
            };
            return;
          } else {
            const data = {
              first_name: isAvailable.first_name,
              last_name: isAvailable.last_name,
              msisdn: isAvailable.msisdn,
              email: isAvailable.email,
              industry: isAvailable.industry,
              role_id: isAvailable.role_id,
              user_id: isAvailable.id,
              company_name: isAvailable.company_name,
              postal_address: isAvailable.postal_address
            }
            const oneHour = 3600
            const jwt = await create({ alg: 'HS512', typ: 'JWT' }, { iss: isAvailable.email, exp: getNumericDate(oneHour) }, key)
            ctx.cookies.set('jwt', new Date());
            ctx.response.body = {
              status: true,
              status_code: 200,
              token: jwt,
              user: data
            };
          }
        } else {
          ctx.response.status = 400;
          ctx.response.body = {
            status: false,
            status_code: 400,
            message: "Password Incorrect",
          };
          return;
        }
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
   * @description Get all Employee List
   */
  createUser: async ({ request, response }: { request: any; response: any },) => {
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
      const isAvailable1 = await userService.loginUser(
        { email: values.email },
      );

      const phoneIsAvailable = await userService.userExist(
        { email: values.email },
      );
      if (isAvailable1) {
        response.status = 404;
        response.body = {
          Status: false,
          status_code: 400,
          message: "Error! Email Exists",
        };
        return;
      }
      if (phoneIsAvailable) {
        response.status = 404;
        response.body = {
          Status: false,
          status_code: 400,
          message: "Error! Phone Exists",
        };
        return;
      }
      else {
        const hashedPassword = await bcrypt.hash(values.password);
        const hashedPassword1 = await bcrypt.hash(values.repeat_password);
        const addUserData = await userService.createUser(
          {
            first_name: values.first_name,
            last_name: values.last_name,
            msisdn: values.msisdn,
            role_id: values.role_id,
            email: values.email,
            industry: values.industry,
            password: hashedPassword,
            company_name: values.company_name,
            postal_address: values.postal_address
          },
        );

        if (addUserData) {

          // if (clientemail) {

          // cookies.set('email_address', values.email);

          response.body = {
            status: true,
            status_code: 200,
            message: "Created Successfully! email has been send",
          };
          // } else {
          //   response.body = {
          //     status: true,
          //     status_code: 200,
          //     message: "Created Successfully! email not send contact the admin",
          //   };
          // }
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

  activateAccount: async (
    { params, response }: { params: { id: string }; response: any },) => {
    try {
      const isAvailable = await userService.activateAccount(
        { id: params.id },
      );
      if (!isAvailable) {
        response.status = 404;
        response.body = {
          status: false,
          message: "User Not found!!",
        };
      } else {
        const data = await userService.activateAccount(
          { id: params.id },
        );
        response.status = 200;
        response.body = {
          status: true,
          status_code: 200,
          message: "Client Account has been activated"
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

  deactiveAccount: async (
    { params, response }: { params: { id: string }; response: any },) => {
    try {
      const isAvailable = await userService.deactiveAccount(
        { id: params.id },
      );
      if (!isAvailable) {
        response.status = 404;
        response.body = {
          status: false,
          message: "User Not found!!",
        };
      } else {
        const data = await userService.deactiveAccount(
          { id: params.id },
        );
        response.status = 200;
        response.body = {
          status: true,
          status_code: 200,
          message: "Client Account has been deactivated",
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


  updateUserPssword: async ({ request, response }: { request: any; response: any },) => {
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
      const hashedPassword = await bcrypt.hash(values.password);

      await userService.updatePassword(
        {
          email: values.email,
          password: hashedPassword,
          // activation_key: values.activation_key
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "User Password Updated Successfully",
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `${error}`,
      };
    }
  },


  updateUser: async ({ request, response }: { request: any; response: any },) => {
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
      const hashedPassword = await bcrypt.hash(values.password);

      await userService.updateUser(
        {
          email: values.email,
          password: hashedPassword,
          // activation_key: values.activation_key
        },
      );
      response.body = {
        status: true,
        status_code: 200,
        message: "User Updated Successfully",
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
  * @description Get all Clients List
  */
  getClients: async (ctx: any) => {
    try {
      // let kw = request.url.searchParams.get('page_number');
      // console.log("bayo", kw)
      let { page_number, filter_value } = getQuery(ctx, { mergeParams: true });
      const total = await userService.getPageSizeCLient();
      if (filter_value == null || filter_value == "") {
        console.log(page_number, '||| params');

        if (page_number == null) {
          page_number = "1"

          const offset = (Number(page_number) - 1) * 10;
          const data = await userService.getClients({
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
          const data = await userService.getClients({
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
        console.log(filter_value, '||| params');

        const data = await userService.getClientFilter({
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


};