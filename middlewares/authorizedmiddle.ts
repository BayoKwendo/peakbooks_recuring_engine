import { Status } from "https://deno.land/x/oak/mod.ts";

import { validateJwt } from "https://deno.land/x/djwt@v1.7/validate.ts";

export default async (ctx: any, next: any) => {

    const jwt = ctx.request.headers
        .get("Authorization");
    // console.log(jwt, '||| params');

    let validatedJwt;
    if (!jwt) {
        ctx.response.body = {
            status: false,
            status_code: 400,
            message: "Access Token Missing!",
        };
    } else {
        const key = "dkdjdddhdhhdhwheruncdfhfhfhdd"
        const jwt = ctx.request.headers
            .get("Authorization");
        validatedJwt = await validateJwt({
            jwt,
            key,
            algorithm: "HS256"
        });

        if (validatedJwt.isValid) {
            await next();
        } else {
            ctx.cookies.delete('jwt');
            ctx.response.body = {
                status: false,
                status_code: 401,
                message: "InValid Token!",
            };
        }
    }
};