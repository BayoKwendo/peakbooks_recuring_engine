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
  .get("/payment_status_bill", authorize, paymentController.getPaymentUnpaidrecordbill)
  .put("/payment_status_bill", authorize, paymentController.updatePaymentBillUnpaidrecord)

  .get("/customer_statement", authorize, paymentController.getCustomerStatements)


  .put("/payment_status", authorize, paymentController.updatePaymentUnpaidrecord)
  .get("/payment_received", authorize, paymentController.getPaymentReceivedPaid)
  .post("/bill", authorize, paymentController.createBill)
  .get("/bill", authorize, paymentController.getBills)
  .get("/recure-bill", authorize, paymentController.getFrequencyBills)
  .put("/recurebill", authorize, paymentController.getFrequencyBills)



  .put("/recurringbill", authorize, paymentController.updatefrequencystatus)
  .put("/recurringbill2", authorize, paymentController.updatefrequencystatus2)

  .get("/billunpaid", authorize, paymentController.getBillUnpaid)
  .post("/payment_received_bill", authorize, paymentController.createPaymentReceivedBillPay)
  .get("/payment_received_bill", authorize, paymentController.getPaymentReceivedPaidbILLS)
  .get("/getbillamount", authorize, paymentController.getBillingsAmount)
  .get("/getamountreceived", authorize, paymentController.getPaymentReceivable)
  .get("/pettycashdebit", authorize, paymentController.getPaymentPettyCash)

  .get("/payment_report", authorize, paymentController.getPaymentReceivedReports)

  .get("/undepositeddebit", authorize, paymentController.getPaymentUndeposited)

  .get("/paymentmadereport", authorize, paymentController.getPaymentMadeReports)

  .get("/billitems", authorize, paymentController.getBillItems)
  .get("/billpaid", authorize, paymentController.getBillPaidReceipt)
  .get("/paymentamountmade", authorize, paymentController.getPaymentMadeReportAmount)

  .post("/cashbank", paymentController.createCashBank)
  .post("/bank", paymentController.createBank)
  .get("/bank", paymentController.getBanks)
  .get("/banking", paymentController.getBankings)

  .get("/agingsummarybill", paymentController.getAgingSummaryBills)






// .put("/estimate",authorize, InvoicesController.updateEstimatePDF)
// .get("/estimate",authorize, InvoicesController.getEstimates)



export default router;
