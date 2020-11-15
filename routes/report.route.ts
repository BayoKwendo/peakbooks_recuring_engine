import { Router } from "https://deno.land/x/oak/mod.ts";
import reportController from "../controllers/reportController.ts";

const router = new Router();

router
  .get("/summary", reportController.getSummary)
  .get("/countSummary", reportController.getCounts)
  // .get("/betPerHour", betController.getBetsPerHour)
  // .get("/getjackPots", betController.jackPots)
  
  .get("/getEod", reportController.getEod)

  .get("/getCountEod", reportController.getCountEod)

  // .get("/betPerHourCount", betController.countBetsPerHour);

  
export default router;
