import express from "express";
import {
  createExpense,
  deleteExpenseById,
  getExpenseSplits,
  getHouseExpenses,
  getHouseTotalBalance,
  settleExpenseById,
  settleExpenseSplitById,
} from "../controllers/expensesController.js";

const router = express.Router();

router.post("/", createExpense);
router.get("/:expense_id", getExpenseSplits);
router.get("/house/:house_id", getHouseExpenses);
router.get("/house/balance/:house_id/user/:user_id", getHouseTotalBalance);
router.put("/settle_all/:expense_id", settleExpenseById);
router.put("/settle_single/:split_id", settleExpenseSplitById);
router.delete("/:expense_id", deleteExpenseById);

export default router;
