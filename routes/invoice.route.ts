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

  .put("/convertesalesorder", authorize, InvoicesController.convertSalesOrder)

  //invocie notes
  .post("/notes", authorize, InvoicesController.creatNotes)
  .put("/notes", authorize, InvoicesController.updateNotes)
  .get("/notes", authorize, InvoicesController.getGeneralNotes)

  //receipt notes
  .post("/receipt_notes", authorize, InvoicesController.createReceiptNotes)
  .put("/receipt_notes", authorize, InvoicesController.updateReceiptNotes)
  .get("/receipt_notes", authorize, InvoicesController.getReceiptNotes)

  .get("/invoiceitem", authorize, InvoicesController.getInvoiceItem)
  .get("/estimateitem", authorize, InvoicesController.getEstimateItem)
  .get("/invoiceunpaid", authorize, InvoicesController.getInvoicesUnpaid)
  .get("/invoicepaid", InvoicesController.getInvoicesPaidReceipt)

  .get("/invoicepaid_record", InvoicesController.getInvoicesPay)

  .get("/invoiceEmail", InvoicesController.getOneInvoices)
  .get("/invoicerecurring", authorize, InvoicesController.getFrequencyInvoices)
  .put("/recurringinvoice", authorize, InvoicesController.updatefrequencystatus)
  .put("/recurringinvoice2", authorize, InvoicesController.updatefrequencystatus2)
  .get("/estimateupdate", authorize, InvoicesController.getInvoiceFilterEstimate)
  .get("/newinvoice", authorize, InvoicesController.getInvoiceNo)
  .put("/invoicesent", authorize, InvoicesController.updateInvoiceSent)

  .delete("/invoiceitemdelete", authorize, InvoicesController.getInvoiceDeleteItems)





  //reports invoices
  .get("/invoiceamount", authorize, InvoicesController.getInvoicesAmount)
  .get("/invoicetaxamount", authorize, InvoicesController.getInvoicesTaxAmount)
  .get("/customerbalance", authorize, InvoicesController.getCustomerBalanceInvoiceReport)
  .get("/agingsummary", authorize, InvoicesController.getAgingSummaryInvoice)

  .get("/customersales", authorize, InvoicesController.getCustomerSales)

  .get("/receivables", authorize, InvoicesController.getReceivableSummary)

  .get("/credittaxamount", authorize, InvoicesController.getInvoicesCreditNoteTax)

  .get("/salesperson", authorize, InvoicesController.getSalesPerson)

  .delete("/salesperson", authorize, InvoicesController.deleteSalesPerson)

  .post("/salesperson", authorize, InvoicesController.createSalesPerson)

  .post("/tax", authorize, InvoicesController.createTax)
  .put("/tax", authorize, InvoicesController.updateTaxRates)

  .delete("/tax", authorize, InvoicesController.deleteTaxRates)

  .delete("/invoice", authorize, InvoicesController.deleteInvoices)


  .delete("/recurringinvoice", authorize, InvoicesController.deleteRecurringInvoices)


  .get("/tax", authorize, InvoicesController.getTaxRates)

  .get("/creditvendortaxamount", authorize, InvoicesController.getInvoicesCreditNoteVendorTax)


  .get("/salespersonreport", authorize, InvoicesController.getSalesPersonReport)

  .get("/invoiceamountratio", authorize, InvoicesController.getInvoicesAmountRatio)

export default router;
