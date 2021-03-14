import { Router } from "https://deno.land/x/oak/mod.ts";
import InvoicesController from "../controllers/InvoicesController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/invoice", authorize, InvoicesController.createInvoices)
  .post("/estimate", authorize, InvoicesController.createEstimates)
  .put("/invoice", authorize, InvoicesController.updateInvoicePDF)
  .put("/estimate", authorize, InvoicesController.updateEstimatePDF)
  .get("/invoice", authorize, InvoicesController.getInvoices)
  .get("/estimate", authorize, InvoicesController.getEstimates)
  .put("/convertestimate", authorize, InvoicesController.convertEstimate)
  .get("/invoiceitem", authorize, InvoicesController.getInvoiceItem)
  .get("/estimateitem", authorize, InvoicesController.getEstimateItem)
  .get("/invoiceunpaid", authorize, InvoicesController.getInvoicesUnpaid)
  .get("/invoicepaid", authorize, InvoicesController.getInvoicesPaidReceipt)
  .get("/invoiceEmail", InvoicesController.getOneInvoices)
  .get("/invoicerecurring", authorize, InvoicesController.getFrequencyInvoices)
  .put("/recurringinvoice", authorize, InvoicesController.updatefrequencystatus)
  .put("/recurringinvoice2", authorize, InvoicesController.updatefrequencystatus2)

  //reports invoices
  .get("/invoiceamount", authorize, InvoicesController.getInvoicesAmount)
  .get("/invoicetaxamount", authorize, InvoicesController.getInvoicesTaxAmount)
  .get("/customerbalance", authorize, InvoicesController.getCustomerBalanceInvoiceReport)
  .get("/agingsummary", authorize, InvoicesController.getAgingSummaryInvoice)

  .get("/customersales", authorize, InvoicesController.getCustomerSales)

  .get("/receivables", authorize, InvoicesController.getReceivableSummary)

  .get("/credittaxamount", authorize, InvoicesController.getInvoicesCreditNoteTax)


  .get("/creditvendortaxamount", authorize, InvoicesController.getInvoicesCreditNoteVendorTax)



export default router;
