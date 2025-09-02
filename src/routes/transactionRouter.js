import express from "express";
import { 
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
  getDreamSavings,
  addDreamSaving,
} from "../controller/func.js";

const router = express.Router();

// ✅ Correct order
router.get("/summary/:userId", getSummaryByUserId);
router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);


// Dream Savings routes
router.get("/dream-savings", getDreamSavings);
router.post("/dream-savings", addDreamSaving);

export default router;
