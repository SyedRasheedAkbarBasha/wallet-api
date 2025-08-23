import express from "express";

import  { getTransactionId,
          deleteTransaction,
          insertTransaction,
          getTransactionDetials } from "../controller/func.js"
          
const router = express.Router();

//Get User Information from GET
router.get("/:UserId", getTransactionId)
//Delete user from database

router.delete("/:id",deleteTransaction);
//from middleware req.body we seperate all attributes
router.post("/",insertTransaction)

router.get("/summary/:UserId",getTransactionDetials);

export default router;