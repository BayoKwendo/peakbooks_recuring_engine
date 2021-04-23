import accountantService from "../services/accountantService.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import { getQuery } from "https://deno.land/x/oak/helpers.ts";
await new Promise((resolve) => setTimeout(resolve, 0));


export default {
    /**
 * @description Add a new journal
 */
    createJournals: async ({
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
            //values from the body
            const values = await body.value;
            const body222 = await accountantService.createJournal({
                date: values.date,
                notes: values.notes,
                amount: values.amount,
                created_by: values.created_by
            });

            if (body222) {
                response.body = {
                    status: true,
                    status_code: 200,
                    message: "Journal added successfully",
                };
            }
        } catch (error) {
            response.status = 400;
            response.body = {
                status: false,
                message: `${error}`,
            };
        }
    },


    /**
  * @description Get all Journal
  */
    getAllJournal: async (ctx: any) => {
        try {
            let { page_number, filter_value, page_size, client_id } = getQuery(ctx, {
                mergeParams: true,
            });
            const total = await accountantService.getPageSizeJournal({
                client_id: Number(client_id),
            });
            if (filter_value == null || filter_value == "") {
                if (page_number == null) {
                    page_number = "1";
                    page_size = "10";
                    const offset = (Number(page_number) - 1) * 10;
                    const data = await accountantService.getJournal({
                        client_id: Number(client_id),
                        offset: Number(offset),
                        page_size: Number(page_size),
                    });
                    ctx.response.body = {
                        status: true,
                        status_code: 200,
                        total: total,
                        data: data,
                    };
                } else {
                    const offset = (Number(page_number) - 1) * 10;

                    const data = await accountantService.getJournal({
                        client_id: Number(client_id),
                        offset: Number(offset),
                        page_size: Number(page_size),
                    });

                    ctx.response.body = {
                        status: true,
                        status_code: 200,
                        total: total,
                        data: data,
                    };
                }
            } else {
                // console.log(filter_value, '||| params');

                const data = await accountantService.getJournalFilter({
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
  * @description Get all Journal items
  */
    getJournalItem: async (ctx: any) => {
        try {
            let { filter_value } = getQuery(ctx, { mergeParams: true });
            const data = await accountantService.getJournalItems({
                filter_value: filter_value,
            });
            ctx.response.body = {
                status: true,
                status_code: 200,
                data: data,
            };
        } catch (error) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: `Error: ${error}`,
            };
        }
    },


};