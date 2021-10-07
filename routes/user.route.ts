import { Router } from "https://deno.land/x/oak/mod.ts";
import authController from "../controllers/authController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/user", authController.createUser)
  .post("/login", authController.loginUser)
  .post("/userupdatepassword", authController.updateUserPssword)
  .get("/client", authorize, authController.getClients)
  .post("/forgot_username", authController.getUsernames)
  .put("/clientactivate/:id", authorize, authController.activateAccount)
  .put("/clientdeactivate/:id", authorize, authController.deactiveAccount)

  .delete("/client/:id", authorize, authController.deleteAccount)
  
  .get("/lost_user", authorize, authController.getUserLost)

  .put("/updateUserClient", authorize, authController.updateClientUser)
  .put("/useractivate/:id", authorize, authController.activateAccountUser)
  .put("/userdeactivate/:id", authorize, authController.deactiveAccountUser)
  .post("/updateUser", authController.updateUser)
  .post("/otp", authController.optSave)
  .post("/otpotherno", authController.optSaveOthernumbers)
  .post("/otpemail", authController.optSaveEmail)

  .post("/mpesa_update", authController.mpesaUpdate)
  .post("/mpesa_update_other_no", authController.mpesaUpdateOtherNo)
  .get("/get_mpesa", authController.usermpesacode)
  .get("/sms", authController.getSMS)



  .post("/verifycode", authController.verifyCode)
  .put("/profile", authController.updateUserProfile)
  .post("/reset-password-request", authController.getPasswordReset)
  .post("/reset-password-save", authController.savePasswordReset)
  .post("/confirm-reset-code", authController.confirmResetCode)

  .get("/document", authorize, authController.getDocumets)

  .get("/transactions", authorize, authController.getMPESATransaction)


  .get("/audit_user", authorize, authController.getAuditTrail)




// .post("/reset", authController.resetPassword)

// // .get("/betPerHourCount", betController.countBetsPerHour);


export default router;
