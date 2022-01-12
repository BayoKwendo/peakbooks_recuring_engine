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

  .put("/payment_received", authorize, paymentController.editPaymentReceivedPay)

  .delete("/payment_received", authorize, paymentController.deleteDeletePaymentReceived)

  .get("/payment_status", authorize, paymentController.getPaymentUnpaidrecord)
  .get("/payment_status_bill", authorize, paymentController.getPaymentUnpaidrecordbill)
  .put("/payment_status_bill", authorize, paymentController.updatePaymentBillUnpaidrecord)

  .get("/customer_statement", authorize, paymentController.getCustomerStatements)
  .get("/vendor_statement", authorize, paymentController.getVendorStatements)


  .put("/payment_status", authorize, paymentController.updatePaymentUnpaidrecord)
  .get("/payment_received", authorize, paymentController.getPaymentReceivedPaid)

  .get("/excess_amount", paymentController.getPaymentExcess)

  .get("/excess_amount_bill", paymentController.getPaymentExcessBills)

  

  
  .post("/bill", authorize, paymentController.createBill)
  .get("/bill", authorize, paymentController.getBills)
  .get("/recure-bill", authorize, paymentController.getFrequencyBills)
  .put("/recurebill", authorize, paymentController.getFrequencyBills)


  //currency rest api  
  .get("/currency", authorize, paymentController.getCurrency)

  .put("/currency", authorize, paymentController.updateCurrency)





  .put("/recurringbill", authorize, paymentController.updatefrequencystatus)
  .put("/recurringbill2", authorize, paymentController.updatefrequencystatus2)

  .get("/billunpaid", authorize, paymentController.getBillUnpaid)
  .post("/payment_received_bill", authorize, paymentController.createPaymentReceivedBillPay)
  .get("/payment_received_bill", authorize, paymentController.getPaymentReceivedPaidbILLS)
  .delete("/payment_received_bill", authorize, paymentController.deleteDeletePaymentMade)


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
  .get("/banking_details", authorize, paymentController.getBankDetails) // get details report for the bankings
  .put("/bank_amount_update", authorize, paymentController.editBankAmount) // update bank amount



  .get("/agingsummarybill", authorize, paymentController.getAgingSummaryBills)
  .put("/update_amount", authorize, paymentController.updateBankAmount)
  .post("/delete_amount", authorize, paymentController.deleteBankAmount)


  // expense account
  .post("/expense_account", authorize, paymentController.createExpenseAccount)
  .get("/expense_account", authorize, paymentController.getExpenseAccount)


  // budget
  .post("/budget", authorize, paymentController.createBugdet)
  .get("/budget", authorize, paymentController.getBudget)
  .put("/budget", authorize, paymentController.updateBugdet)




// .put("/estimate",authorize, InvoicesController.updateEstimatePDF)
// .get("/estimate",authorize, InvoicesController.getEstimates)



export default router;
