import { Router } from "https://deno.land/x/oak/mod.ts";
import customerController from "../controllers/customerController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';


const router2 = new Router();

router2
  .post("/customer",authorize, customerController.createCustomer)

  .get("/customer",authorize, customerController.getAllCustomers)
  .put("/customer",authorize, customerController.updateUserCustomer)
  
  .put("/customermore",authorize, customerController.updateUserCustomerMore)

  .post("/customermore",authorize, customerController.createBilling)

  .get("/custom_balance", authorize, customerController.getAllCustomerBalance)

  .get("/customermore",authorize, customerController.getAllCustomersInfo)
  .get("/custom_balanceratio", authorize, customerController.getCustomerBalanceRatio)


export default router2;
