import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";


const clientemail = new SmtpClient();


const connectConfig: any = {
  hostname: "smtp.gmail.com",
  port: 465,
  username: "bayokwendo@gmail.com",
  password: "omulama96",
};
await clientemail.connectTLS(connectConfig);

await clientemail.send({
  from: "admin@insightpeak.com",
  to: "bayokwendo@gmail.com",
  subject: "Confirmation",
  content: "Mail Content，maybe HTML",
});
 
await clientemail.close();

export default clientemail;
