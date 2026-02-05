import express from "express";
import {
  createExpense,
  getExpenseSplits,
  getHouseExpenses,
  getHouseTotalBalance,
} from "../controllers/expensesController.js";

const router = express.Router();

router.post("/", createExpense);
router.get("/:expense_id", getExpenseSplits);
router.get("/house/:house_id", getHouseExpenses);
router.get("/house/balance/:house_id/user/:user_id", getHouseTotalBalance);

export default router;
