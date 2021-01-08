import { Router } from "https://deno.land/x/oak/mod.ts";
import CreditController from "../controllers/creditController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/credit", authorize, CreditController.createCreditNote)
  // .post("/estimate", authorize, InvoicesController.createEstimates)
  // .put("/invoice", authorize, InvoicesController.updateInvoicePDF)
  .put("/credit", authorize, CreditController.updateCreditNote)
  .get("/credit", authorize, CreditController.getCreditNote)
  .get("/creditItem", authorize, CreditController.getCreditItem)
// .put("/convertestimate", authorize, InvoicesController.convertEstimate)
// .get("/invoiceitem", authorize, InvoicesController.getInvoiceItem)
// .get("/estimateitem", authorize, InvoicesController.getEstimateItem)
// .get("/invoiceunpaid", authorize, InvoicesController.getInvoicesUnpaid)
// .get("/invoicepaid", authorize, InvoicesController.getInvoicesPaidReceipt)
// .get("/invoiceEmail", InvoicesController.getOneInvoices)
// .get("/invoicerecurring", authorize, InvoicesController.getFrequencyInvoices)
// .put("/recurringinvoice", authorize, InvoicesController.updatefrequencystatus)



export default router;
