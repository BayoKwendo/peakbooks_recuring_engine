import { Router } from "https://deno.land/x/oak/mod.ts";
import InvoicesController from "../controllers/InvoicesController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/invoice",authorize, InvoicesController.createInvoices)
  .post("/estimate",authorize, InvoicesController.createEstimates)

   
export default router;
