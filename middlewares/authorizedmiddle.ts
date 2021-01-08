import { Status } from "https://deno.land/x/oak/mod.ts";

// import { validateJwt } from "https://deno.land/x/djwt@v1.7/validate.ts";
import { verify, decode } from "https://deno.land/x/djwt@v2.0/mod.ts"

export default async (ctx: any, next: any) => {

    const jwt = ctx.request.headers
        .get("Authorization");
    if (!jwt) {
        ctx.response.body = {
            status: false,
            status_code: 400,
            message: "Access Token Missing!",
        };
    } else {
        try {
            const key = "dkdjdddhdhhdhwheruncdfhfhfhdd"
            const data: any = await verify(jwt, key, "HS512");
            ctx.cookies.delete('jwt');
            ctx.response.body = data
            await next();
        } catch (error) {
            // ctx.response.status = 400;
            ctx.response.body = {
                status_code: 401,
                status: false,
                message: `${error}`,
            };
        }
    }
};