import { Application } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import employeeRouter from "./routes/employee.route.ts";
import incomeRouter from "./routes/income.route.ts";
import depositRouter from "./routes/deposit.route.ts";
import betRouter from "./routes/bet.route.ts";
import reportRouter from "./routes/report.route.ts";
import testRouter from "./routes/connect.route.ts";
import userRouter from "./routes/user.route.ts";

import logger from './middlewares/logger.ts';
import notFound from './middlewares/notFound.ts';

const app = new Application();
const port: number = 8090;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
    }),
);
app.use(logger.logger);
app.use(logger.responseTime);

app.use(userRouter.routes());
app.use(userRouter.allowedMethods()); 
app.use(testRouter.routes());
app.use(testRouter.allowedMethods());
app.use(reportRouter.routes());
app.use(reportRouter.allowedMethods()); 
app.use(employeeRouter.routes());
app.use(employeeRouter.allowedMethods());
app.use(incomeRouter.routes());
app.use(incomeRouter.allowedMethods());
app.use(betRouter.routes());
app.use(betRouter.allowedMethods());
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
  console.log(`${yellow("Listening on:")} ${green(url)}`,);});  
await app.listen({ port });   