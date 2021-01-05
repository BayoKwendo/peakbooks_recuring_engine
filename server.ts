import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import customerRoutes from "./routes/customer.route.ts";
import incomeRouter from "./routes/income.route.ts";
import depositRouter from "./routes/deposit.route.ts";
import invoiceRouter from "./routes/invoice.route.ts";
import reportRouter from "./routes/report.route.ts";
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



daily(() => {
  console.log('I run on daily basis')
});

weekly(() => {
  console.log('This method will run on weekly bases')
});

everyMinute(() => {
  // console.log('This method will run on 60 seconds')
})


let task = cron('*/1 * * * * *', async () => {
  const total = await itemService.getPageSizeItem({
    client_id: Number("9"),
  });

  const invoice_no = await invoiceService.getfrequency();

  console.log(invoice_no)
  // app.use(router.routes())
  // app.use(router.allowedMethods())
  // router.get("sdd", ItemController.getItems)
});

1609789121551

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