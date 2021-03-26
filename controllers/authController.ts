import { Status } from "https://deno.land/x/oak/mod.ts";
import { getQuery } from "https://deno.land/x/oak/helpers.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import userService from "../services/userService.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.0/mod.ts";
// import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt@v0.9.0/create.ts";
import clientemail from "../db/clientemail.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

// const header: Jose = ;

const key = "dkdjdddhdhhdhwheruncdfhfhfhdd";
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

      const isAvailable = await userService.loginUser({ email: values.email });
      if (!isAvailable) {
        ctx.response.status = 404;
        ctx.response.body = {
          status: false,
          status_code: 400,
          message: "Email not found",
        };
        return;
      } else {
        const result = await bcrypt.compare(
          values.password,
          isAvailable.password
        );
        if (result) {
          const checkActive = await userService.checkActive({
            email: values.email,
          });
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
              paid: isAvailable.paid,
              first_time: isAvailable.first_time,
              our_client: isAvailable.our_client,
              company_name: isAvailable.company_name,
              postal_address: isAvailable.postal_address,
            };

            //3600 one hour
            const oneHour = 1223600;
            const jwt = await create(
              { alg: "HS512", typ: "JWT" },
              { iss: isAvailable.email, exp: getNumericDate(oneHour) },
              key
            );
            ctx.cookies.set("jwt", new Date());
            ctx.response.body = {
              status: true,
              status_code: 200,
              token: jwt,
              user: data,
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
  createUser: async ({
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
    if (!values.first_name) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please enter your first name",
      };
      return;
    }
    if (!values.last_name) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please enter your last name",
      };
      return;
    }
    if (!values.msisdn) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please enter your phone number",
      };
      return;
    }
    if (!values.email) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please enter your email",
      };
      return;
    }
    if (!values.company_name) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please enter company name",
      };
      return;
    }
    if (!values.industry) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Please select industry",
      };
      return;
    }
    try {
      const values = await body.value;
      const isAvailable1 = await userService.loginUser({ email: values.email });

      const phoneIsAvailable = await userService.userExist({
        email: values.email,
      });
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
      } else {
        const hashedPassword = await bcrypt.hash(values.password);
        const hashedPassword1 = await bcrypt.hash(values.repeat_password);
        const addUserData = await userService.createUser({
          first_name: values.first_name,
          last_name: values.last_name,
          msisdn: values.msisdn,
          role_id: values.role_id,
          our_client: values.our_client,
          email: values.email,
          first_time: values.first_time,
          industry: values.industry,
          paid: values.paid,
          subscription: values.subscription,
          password: hashedPassword,
          company_name: values.company_name,
          postal_address: values.postal_address,
        });

        // console.log(addUserData)

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



  activateAccount: async ({
    params,
    response,
  }: {
    params: { id: string };
    response: any;
  }) => {
    try {
      const isAvailable = await userService.activateAccount({ id: params.id });
      if (!isAvailable) {
        response.status = 404;
        response.body = {
          status: false,
          message: "User Not found!!",
        };
      } else {
        const data = await userService.activateAccount({ id: params.id });
        response.status = 200;
        response.body = {
          status: true,
          status_code: 200,
          message: "Client Account has been activated",
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

  deactiveAccount: async ({
    params,
    response,
  }: {
    params: { id: string };
    response: any;
  }) => {
    try {
      const isAvailable = await userService.deactiveAccount({ id: params.id });
      if (!isAvailable) {
        response.status = 404;
        response.body = {
          status: false,
          message: "User Not found!!",
        };
      } else {
        const data = await userService.deactiveAccount({ id: params.id });
        response.status = 200;
        response.body = {
          status: true,
          status_code: 200,
          message: "Client Account has been deactivated",
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

  updateUserPssword: async ({
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
      const hashedPassword = await bcrypt.hash(values.password);

      await userService.updatePassword({
        email: values.email,
        password: hashedPassword,
        // activation_key: values.activation_key
      });
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

  updateUser: async ({
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
      const hashedPassword = await bcrypt.hash(values.password);

      await userService.updateUser({
        email: values.email,
        password: hashedPassword,
        // activation_key: values.activation_key
      });
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
        console.log(page_number, "||| params");

        if (page_number == null) {
          page_number = "1";

          const offset = (Number(page_number) - 1) * 10;
          const data = await userService.getClients({
            offset: Number(offset),
          });
          ctx.response.body = {
            status: true,
            status_code: 200,
            total: total,
            data: data,
          };
        } else {
          const offset = (Number(page_number) - 1) * 10;
          const data = await userService.getClients({
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
        console.log(filter_value, "||| params");

        const data = await userService.getClientFilter({
          filter_value: filter_value,
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



  /**
  * @description Get all Generate opt and send
  */
  optSave: async ({
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
    try {
      const values = await body.value;
      const otpSave = await userService.optsave({
        code: values.code,
        msisdn: values.msisdn,
        expired: values.expired
      });

      if (otpSave) {
        // console.log(data3)
        const postRequest = await fetch('https://api.vaspro.co.ke/v3/BulkSMS/api/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              "apiKey": "8f15430edfeb253fb0961c36e0fee0cc",
              "shortCode": "PEAKBOOKS",
              "message": values.code.toString(),
              "recipient": values.msisdn.toString(),
              "callbackURL": "https://api.vaspro.co.ke",
              "enqueue": 0
            }),
        })

        console.log(postRequest)

        if (postRequest) {
          response.body = {
            status: true,
            status_code: 200,
            message: "Success! code has been send",
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


  verifyCode: async (ctx: any) => {
    try {
      const body = await ctx.request.body();
      const values = await body.value;

      const total = await userService.getOTP({
        code: values.code,
        msisdn: values.msisdn
      });

      if (total > 0) {
        const data = await userService.updateVerify({
          code: values.code,
          msisdn: values.msisdn
        });
        console.log(total)
        ctx.response.body = {
          status: true,
          message: "Verified! Redirecting",
          status_code: 200,
        };
      } else {
        ctx.response.body = {
          status: false,
          message: "Invalid code",
          status_code: 200,
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
