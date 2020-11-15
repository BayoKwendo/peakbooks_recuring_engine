import { Router } from "https://deno.land/x/oak/mod.ts";
import employeeController from "../controllers/employeeController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';


const router2 = new Router();

router2
  .get("/customers",authorize, employeeController.getAllEmployees)
  .get("/customersone/:mobile", employeeController.getCustomrByMobile)

  .get("/filter", employeeController.filterCustomers)
  .post("/customers", employeeController.createEmployee)
  .get("/count", employeeController.countCustomers)
  .get("/balance", employeeController.countBalance)
  .get("/blacklistCount", employeeController.countBlackList)
  .get("/blacklisted", employeeController.getBlackListed)
  .post("/createBlackList", employeeController.createEmployee)
  .delete("/deleteBlackListed/:mobile", employeeController.deleteEmployeeById)

  .get("/countbound/:mobile", employeeController.countBound)

  .get("/inbound", employeeController.getInboundMessages)
  .get("/outbound", employeeController.getOutboundMessages)
  
  .get("/getcustomerlog", employeeController.getCustomerLog)

  .get("/getCountOutMsgs/:mobile", employeeController.countOutMsgs)

  
  .get("/bound", employeeController.getBound)
  .get("/customerOneDetails/:mobile", employeeController.getCustomrDetails)
  .get("/games", employeeController.getGames);
  
  
  

export default router2;
