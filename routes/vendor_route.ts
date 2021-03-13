import { Router } from "https://deno.land/x/oak/mod.ts";
import vendorController from "../controllers/vendorController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';


const router = new Router();

router
  .post("/vendor", authorize, vendorController.createVendor)
  .post("/expense", authorize, vendorController.createExpense)
  .get("/expense", authorize, vendorController.getAllExpenses)

  .get("/vendor", authorize, vendorController.getAllVendors)
  .get("/expense_recurring", authorize, vendorController.getAllExpensesRecuring)

  .put("/vendor", authorize, vendorController.updateVendor)
  .put("/recurringexpense", authorize, vendorController.updatefrequencyexpensestatus)
  .put("/recurringexpense2", authorize, vendorController.updatefrequencyexpensestatus2)
  .get("/expensesamount", authorize, vendorController.getExpenseReport)

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

  .get("/rembursementcredit", authorize, vendorController.getReimbursementsCredit)
  .get("/taxamountexpense", authorize, vendorController.getTaxAmountTaxExpense)

  .get("/drawings", authorize, vendorController.getDrawings)
  .get("/offsetbalance", authorize, vendorController.getOffsetBalance)


  //sales by vendor purchase report
  .get("/vendorpurchase", authorize, vendorController.getVendorSales)

  //vendorbalance report 
  .get("/vendorbalancebill", authorize, vendorController.getVendorBalanceBills)
  .get("/payablesummary", authorize, vendorController.getPayableSummary)

  .get("/vendorcreditreport", authorize, vendorController.getVendorCredit)

  .get("/investmentreport", authorize, vendorController.getInvestmentReport)


// .post("/customermore",authorize, customerController.createBilling)
// .get("/customermore",authorize, customerController.getAllCustomersInfo)

export default router;
