import { Router } from "https://deno.land/x/oak/mod.ts";
import vendorController from "../controllers/vendorController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';


const router = new Router();

router
  .post("/vendor",authorize, vendorController.createVendor)
  .post("/expense",authorize, vendorController.createExpense)
  .get("/expense",authorize, vendorController.getAllExpenses)

  .get("/vendor",authorize, vendorController.getAllVendors)
  .get("/expense_recurring",authorize, vendorController.getAllExpensesRecuring)

  .put("/recurringexpense", authorize, vendorController.updatefrequencyexpensestatus)
  .put("/recurringexpense2", authorize, vendorController.updatefrequencyexpensestatus2)
  
  // .put("/customer",authorize, customerController.updateUserCustomer)
  // .put("/customermore",authorize, customerController.updateUserCustomerMore)
  // .post("/customermore",authorize, customerController.createBilling)
  // .get("/customermore",authorize, customerController.getAllCustomersInfo)
  
export default router;
