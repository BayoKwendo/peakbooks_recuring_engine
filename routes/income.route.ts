import { Router } from "https://deno.land/x/oak/mod.ts";
import incomeController from "../controllers/incomeController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router4 = new Router();

router4
  .get("/houseincome", authorize, incomeController.getAllDailyIncome)
  .get("/incomecount", authorize, incomeController.countIncome)
  .get("/wallet", authorize, incomeController.getWallet)
  .get("/winloss", authorize, incomeController.getWinLoss)
  .get("/nlcarchives", authorize, incomeController.getNLArchives)
  .get("/stake", authorize, incomeController.getStake);

  
  
export default router4;
