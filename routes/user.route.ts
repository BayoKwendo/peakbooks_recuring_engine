import { Router } from "https://deno.land/x/oak/mod.ts";
import authController from "../controllers/authController.ts";

const router = new Router();

router
  .post("/user", authController.createUser)
  .post("/login", authController.loginUser)
  .post("/updateUser", authController.updateUser)
  // // .get("/getjackPots", betController.jackPots)
  
  // .get("/getEod", reportController.getEod)

  // .get("/getCountEod", reportController.getCountEod)

  // // .get("/betPerHourCount", betController.countBetsPerHour);

  
export default router;
