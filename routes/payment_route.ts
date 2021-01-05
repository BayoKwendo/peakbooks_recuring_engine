import { Router } from "https://deno.land/x/oak/mod.ts";
import paymentController from "../controllers/paymentController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/payment_method", authorize, paymentController.createPaymentMethod)
  .get("/payment_method", authorize, paymentController.getPayments)
  .post("/deposit_to", authorize, paymentController.createDeposit_to)
  .get("/deposit_to", authorize, paymentController.getDeposit_to)
  .post("/payment_received", authorize, paymentController.createPaymentReceivedPay)
  .get("/payment_status", authorize, paymentController.getPaymentUnpaidrecord)
  .put("/payment_status", authorize, paymentController.updatePaymentUnpaidrecord)
  .get("/payment_received", authorize, paymentController.getPaymentReceivedPaid)

  
// .put("/estimate",authorize, InvoicesController.updateEstimatePDF)
// .get("/estimate",authorize, InvoicesController.getEstimates)



export default router;
