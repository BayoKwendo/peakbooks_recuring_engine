import { Router } from "https://deno.land/x/oak/mod.ts";
import ItemController from "../controllers/itemController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .post("/item",authorize, ItemController.createITEM)

  .put("/item",authorize, ItemController.updateItem)
  .delete("/item/:id",authorize, ItemController.deleteItem)

  .get("/item",authorize, ItemController.getItems)
  .get("/salesbyitem", authorize, ItemController.getItemSales)
  .get("/purchasebyitem", authorize, ItemController.getItemPurchase)
  .post("/investment", authorize, ItemController.addInvestment)
  .get("/investment", authorize, ItemController.getinvestment)
  // .put("/estimate",authorize, InvoicesController.updateEstimatePDF)
  // .get("/estimate",authorize, InvoicesController.getEstimates)

  
  
export default router;
