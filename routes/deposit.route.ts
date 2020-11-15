import { Router } from "https://deno.land/x/oak/mod.ts";
import dailyDepositController from "../controllers/dailyDepositController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router1 = new Router();

router1
  .get("/dailydeposit",authorize, dailyDepositController.getAllDailyDeposit)
  .get("/getpaystack",authorize, dailyDepositController.getPayStack)
  .get("/getMTNDeposits",authorize, dailyDepositController.getMTNDeposits)
  .get("/getMTNDepositRates",authorize, dailyDepositController.getMTNDepositRates)
  .get("/getDailyIncome",authorize, dailyDepositController.getDailyIncome)
  .get("/getPayCodes",authorize, dailyDepositController.getPayCodes)
  .get("/getWithdrawals", dailyDepositController.getCustomerWithdrawals)
  .get("/getCountMTNRates", dailyDepositController.countMTNDeposits)
  .get("/transaction", dailyDepositController.getTransaction)
  .get("/depositrequestes", dailyDepositController.getDepositRequest)

export default router1;
