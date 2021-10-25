import { Router } from "https://deno.land/x/oak/mod.ts";
import accountantController from "../controllers/accountantController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/journals", authorize, accountantController.createJournals)
  .get("/journals", authorize, accountantController.getAllJournal)
  .get("/journals_items", authorize, accountantController.getJournalItem)


// .put("/estimate",authorize, InvoicesController.updateEstimatePDF)
// .get("/estimate",authorize, InvoicesController.getEstimates)
export default router;
