import { Router } from "https://deno.land/x/oak/mod.ts";
import vendorController from "../controllers/vendorController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';


const router = new Router();

router
  .post("/vendor", authorize, vendorController.createVendor)
  .delete("/vendor", authorize, vendorController.deleteVendor)


//expenses
  .get("/expenseone", authorize, vendorController.getExpenseOne)
  .post("/expense", authorize, vendorController.createExpense)
  .get("/expense", authorize, vendorController.getAllExpenses)
  .delete("/expense", authorize, vendorController.deleteExpense)
  .put("/expense", authorize, vendorController.editExpense)


  .get("/expensejournal", authorize, vendorController.getExpensesJournal)
  .get("/vendor", authorize, vendorController.getAllVendors)
  .get("/expense_recurring", authorize, vendorController.getAllExpensesRecuring)
  .delete("/expense_recurring", authorize, vendorController.deleteExpenseRecurring)

  .put("/vendor", authorize, vendorController.updateVendor)
  .put("/recurringexpense", authorize, vendorController.updatefrequencyexpensestatus)
  .put("/recurringexpense2", authorize, vendorController.updatefrequencyexpensestatus2)

  .put("/recurringfrequency", authorize, vendorController.updatefrequencyexpensefrequency)


  .get("/expensesamount", authorize, vendorController.getExpenseReport)

  .put("/updatevendorbalance", authorize, vendorController.updateOutofBalance)

  .get("/vendor_payment_record", authorize, vendorController.getBillsPay)


  .get("/operationexpense", authorize, vendorController.getExpenseReportExpenseCost)
  .get("/vendorbalance", authorize, vendorController.getVendorBalance)
  .get("/advancetax", authorize, vendorController.getAdvanceTax)
  .get("/taxpayable", authorize, vendorController.getTaxpayable)
  .get("/employeeadvance", authorize, vendorController.getEmployeeAdvance)
  .get("/rembursement", authorize, vendorController.getReimbursements)
  .get("/prepaid", authorize, vendorController.getPrepaidExpense)
  .get("/payablepaid", authorize, vendorController.getTaxpayablePaid)
  .get("/furtinure", authorize, vendorController.getFurnitureandEquipment)
  .get("/pettycashcredit", authorize, vendorController.getPettyCash)
  .get("/undepositedcredit", authorize, vendorController.getUndepositedFunds)
  .get("/advancetaxpaid", authorize, vendorController.getAdvanceTaxPaid)
  .get("/employee_expense2", authorize, vendorController.getEmployeeAdvanceExpense)
  .get("/furniture2", authorize, vendorController.getFurnitureandEquipmentCredit)
  .get("/prepaid2", authorize, vendorController.getPrepaidExpensesDebit)

  .get("/othercurrentassets", authorize, vendorController.othercurrentasset)
  .get("/intangibleasset", authorize, vendorController.intangibleasset)
  .get("/othernoncurrent", authorize, vendorController.othernoncurrent)


  .get("/rembursementcredit", authorize, vendorController.getReimbursementsCredit)
  .get("/taxamountexpense", authorize, vendorController.getTaxAmountTaxExpense)

  .get("/drawings", authorize, vendorController.getDrawings)
  .get("/offsetbalance", authorize, vendorController.getOffsetBalance)


  //sales by vendor purchase report
  .get("/vendorpurchase", authorize, vendorController.getVendorSales)

  .get("/vendorexpenses", authorize, vendorController.getVendorExpenses)

  .get("/customer_expense", authorize, vendorController.getCustomerExpenses)


  //vendorbalance report 
  .get("/vendorbalancebill", authorize, vendorController.getVendorBalanceBills)
  .get("/payablesummary", authorize, vendorController.getPayableSummary)

  .get("/vendorcreditreport", authorize, vendorController.getVendorCredit)

  .get("/investmentreport", authorize, vendorController.getInvestmentReport)

  .get("/liabilities", authorize, vendorController.getLiability)



// .post("/customermore",authorize, customerController.createBilling)
// .get("/customermore",authorize, customerController.getAllCustomersInfo)

export default router;
