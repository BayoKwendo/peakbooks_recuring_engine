import { Router } from "https://deno.land/x/oak/mod.ts";
import vendorController from "../controllers/vendorController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';


const router = new Router();

router
  .post("/vendor",authorize, vendorController.createVendor)

  .get("/vendor",authorize, vendorController.getAllVendors)
  // .put("/customer",authorize, customerController.updateUserCustomer)
  
  // .put("/customermore",authorize, customerController.updateUserCustomerMore)

  // .post("/customermore",authorize, customerController.createBilling)

  // .get("/customermore",authorize, customerController.getAllCustomersInfo)

  
export default router;
