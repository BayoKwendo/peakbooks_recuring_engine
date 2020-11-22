import { Router } from "https://deno.land/x/oak/mod.ts";
import customerController from "../controllers/customerController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';


const router2 = new Router();

router2
  .post("/customer",authorize, customerController.createCustomer)

  .get("/customer",authorize, customerController.getAllCustomers)

  .post("/customermore",authorize, customerController.createBilling)
  
export default router2;
