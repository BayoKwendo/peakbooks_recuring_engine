import { Router } from "https://deno.land/x/oak/mod.ts";
import betController from "../controllers/betController.ts";

const router = new Router();

router
  .get("/betPerDay", betController.getBetsPerDay)
  .get("/countbetPerDay", betController.countBetsPerDay)
  .get("/betPerHour", betController.getBetsPerHour)
  .get("/getjackPots", betController.jackPots)
  
  .get("/getAverage", betController.average)

  .get("/otherWinners", betController.otherWinners)

  .get("/betPerHourCount", betController.countBetsPerHour);

  
export default router;
