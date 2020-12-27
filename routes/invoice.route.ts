import { Router } from "https://deno.land/x/oak/mod.ts";
import InvoicesController from "../controllers/InvoicesController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/invoice",authorize, InvoicesController.createInvoices)
  .post("/estimate",authorize, InvoicesController.createEstimates)
  .put("/invoice",authorize, InvoicesController.updateInvoicePDF)
  .put("/estimate",authorize, InvoicesController.updateEstimatePDF)
  .get("/invoice",authorize, InvoicesController.getInvoices)
  .get("/estimate",authorize, InvoicesController.getEstimates)
  .get("/invoiceitem",authorize, InvoicesController.getInvoiceItem)
  .get("/estimateitem",authorize, InvoicesController.getEstimateItem)
  .get("/invoiceunpaid",authorize, InvoicesController.getInvoicesUnpaid)
  .get("/invoicepaid",authorize, InvoicesController.getInvoicesPaidReceipt)

  
export default router;
