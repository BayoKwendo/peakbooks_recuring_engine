import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import customerRoutes from "./routes/customer.route.ts";
import incomeRouter from "./routes/income.route.ts";
import depositRouter from "./routes/deposit.route.ts";
import invoiceRouter from "./routes/invoice.route.ts";
import reportRouter from "./routes/report.route.ts";
import creditRouter from "./routes/credit.route.ts";

import testRouter from "./routes/connect.route.ts";
import userRouter from "./routes/user.route.ts";
import itemRouter from "./routes/item.route.ts";
import paymentRouter from "./routes/payment_route.ts";
import itemService from "./services/itemService.ts ";

import invoiceService from "./services/invoiceService.ts ";

import logger from './middlewares/logger.ts';
import notFound from './middlewares/notFound.ts';
import { cron, start, stop, everyMinute, daily, weekly } from 'https://deno.land/x/deno_cron/cron.ts';



const app = new Application();
const router = new Router()
const port: number = 8090;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
);
app.use(logger.logger);
app.use(logger.responseTime);
// daily(() => {
//   console.log('I run on daily basis')
// });
// weekly(() => {
//   console.log('This method will run on weekly bases')
// });
// everyMinute(() => {
//   // console.log('This method will run on 60 seconds')
// })
let task = cron('*/.5 * * * * *', async () => {
  stop()
  const invoice_no = await invoiceService.getfrequency();
  if (invoice_no) {
    const data = await invoiceService.getInvoiceFilter({
      filter_value: invoice_no.invoice_no
    });
    const itemData = await invoiceService.getInvoiceItems({
      filter_value: invoice_no.invoice_no,
    });
    try {
      const body222 = await invoiceService.createInvoice(
        {
          customer_id: data[0].customer_id,
          invoice_no: data[0].invoice_no,
          terms: data[0].terms,
          due_date: data[0].due_date,
          invoice_date: data[0].invoice_date,
          message_invoice: data[0].message_invoice,
          statement_invoice: data[0].statement_invoice,
          amount: data[0].amount,
          estimate: data[0].estimate,
          due_amount: data[0].due_amount,
          discount_amount: data[0].discount_amount,
          sub_total: data[0].sub_total,
          tax_amount: data[0].tax_amount,
          created_by: data[0].created_by,
          recurring: data[0].recurring
        }
      );
      if (body222) {
        let page_number = "1"
        const offset = (Number(page_number) - 1) * 2;
        const dataInvoice = await invoiceService.getInvoices({
          offset: offset,
          estimate: "0",
          created_by: data[0].created_by
        });

        // let innvoiceNo = { invoice_no: dataInvoice[0].invoice_no };
        let data3 = [];

        for (let i = 0; i < itemData.length; i++) {
          let innvoiceNo = { invoice_no2: dataInvoice[0].invoice_no };
          data3.push(Object.assign(innvoiceNo, itemData[i]));
        }
        // console.log(data3)
        const postRequest = await fetch('http://localhost:8000/recurring_invoice.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data3),
        })
        if (postRequest) {

          if (invoice_no.frequency_type === "Daily") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (1 * 24 * 60 * 60)).toString(),
            });
            if (updateData) {
              start();
              console.log('Done')
            }
          }
          else if (invoice_no.frequency_type === "Weekly") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (7 * 24 * 60 * 60)).toString()
            });
            if (updateData) {
              start();
              console.log('Done')
            }
          }
          else if (invoice_no.frequency_type === "After 2 Weeks") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (14 * 24 * 60 * 60)).toString()
            });
            if (updateData) {
              start();
              console.log('Done')
            }
          }
          else if (invoice_no.frequency_type === "Monthly") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (30 * 24 * 60 * 60)).toString()
            });
            if (updateData) {
              start();
              console.log('Done')
            }
          }
          else if (invoice_no.frequency_type === "After 2 Months") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (60 * 24 * 60 * 60)).toString()
            });
            if (updateData) {
              start();
              console.log('Done')
            }
          }
          else if (invoice_no.frequency_type === "After 3 Months") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (90 * 24 * 60 * 60)).toString(),
            });
            if (updateData) {
              start();
            }
          }
          else if (invoice_no.frequency_type === "After 6 Months") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (180 * 24 * 60 * 60)).toString(),
            });
            if (updateData) {
              start();
            }
          }
          else if (invoice_no.frequency_type === "Yearly") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (365 * 24 * 60 * 60)).toString(),
            });
            if (updateData) {
              start();
            }
          }
          else if (invoice_no.frequency_type === "After 2 Years") {
            const updateData = await invoiceService.updatefrequency({
              invoice_no: invoice_no.invoice_no,
              frequecy: ((Date.now() / 1000) + (730 * 24 * 60 * 60)).toString(),
            });
            if (updateData) {
              start();
            }
          }
          // start()
        }
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    start()
    // console.log(new Date())
  }
});


app.use(creditRouter.routes());
app.use(creditRouter.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(itemRouter.routes());
app.use(itemRouter.allowedMethods());
app.use(customerRoutes.routes());
app.use(customerRoutes.allowedMethods());
app.use(testRouter.routes());
app.use(testRouter.allowedMethods());
app.use(reportRouter.routes());
app.use(reportRouter.allowedMethods());
app.use(paymentRouter.routes());
app.use(paymentRouter.allowedMethods());
app.use(incomeRouter.routes());
app.use(incomeRouter.allowedMethods());
app.use(invoiceRouter.routes());
app.use(invoiceRouter.allowedMethods());
app.use(depositRouter.routes());
app.use(depositRouter.allowedMethods());

// 404 page
app.use(notFound);
app.addEventListener("error", (evt) => {
  console.log(evt.error);
});
app.use((ctx) => {
  ctx.throw(500);
});

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(`${yellow("Listening on:")} ${green(url)}`,);
});
await app.listen({ port });   