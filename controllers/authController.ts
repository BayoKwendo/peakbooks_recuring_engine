import { Status } from 'https://deno.land/x/oak/mod.ts';
import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import userService from '../services/userService.ts';
import { hashSync, compareSync } from "https://deno.land/x/bcrypt@v0.2.1/mod.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt@v0.9.0/create.ts";
import clientemail from "../db/clientemail.ts";


const header: Jose = {
  alg: 'HS256',
  typ: 'JWT'
};

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
      const hashedPassword = hashSync(values.password);

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
      else if (!compareSync(values.password, isAvailable.password)) {
        ctx.response.status = 404;
        ctx.response.body = {
          status: false,
          status_code: 400,
          message: "Password Incorrect",
        };
        return;
      }

      else {
        const oneHour = 300
        const payload: Payload =
        {
          iss: isAvailable.username,
          exp: setExpiration(Date.now() / 1000 + oneHour),
        };
        const data = {
          first_name: isAvailable.first_name,
          last_name: isAvailable.last_name,
          msisdn: isAvailable.msisdn,
          email: isAvailable.email,
          industry: isAvailable.industry,
          role_id: isAvailable.role_id
        }
        const jwt = makeJwt({ header, payload, key })
        ctx.cookies.set('jwt', jwt);
        ctx.response.body = {
          status: true,
          status_code: 200,
          token: jwt,
          user: data
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
        const hashedPassword = hashSync(values.password);
        const hashedPassword1 = hashSync(values.repeat_password);
        await userService.createUser(
          {
            first_name: values.first_name,
            last_name: values.last_name,
            msisdn: values.msisdn,
            role_id: values.role_id,
            email: values.email,
            industry: values.industry,
            password: hashedPassword,
          },
        );
        response.body = {
          status: true,
          status_code: 200,
          message: "Created Successfully! email has been send",
        };

        await clientemail.send({
          from: "admin@insightpeak.com",
          to: values.email,
          subject: "Confirmation",
          content: "Mail Content，maybe HTML",
        });
        await clientemail.close();

      }
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
      const hashedPassword = values.password;

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
};