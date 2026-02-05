import {
  deleteExpense,
  fetchExpenseSplits,
  fetchHouseExpenses,
  fetchHouseTotalBalance,
  fetchUserTotalBalanceByHouse,
  insertExpense,
  insertExpenseSplit,
  settleExpense,
  settleExpenseSplit,
} from "../models/expensesModel.js";

export async function getHouseExpenses(req, res) {
  try {
    const house_id = req.params.house_id;
    const expenses = await fetchHouseExpenses(house_id);
    res.status(200).json(expenses);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getHouseTotalBalance(req, res) {
  try {
    const house_id = req.params.house_id;
    const user_id = req.params.user_id;
    console.log("house_id:", house_id, "user_id:", user_id);
    const houseBalance = await fetchHouseTotalBalance(house_id);
    const userBalance = await fetchUserTotalBalanceByHouse(house_id, user_id);
    res.status(200).json({ houseBalance, userBalance });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function createExpense(req, res) {
  try {
    const {
      house_id,
      title,
      total_amount,
      paid_by,
      split_type,
      expense_type,
      splits,
    } = req.body;
    const expense = await insertExpense(
      house_id,
      title,
      total_amount,
      paid_by,
      split_type,
      expense_type,
    );
    // Also insert each individual expense_splits
    const expense_id = expense.id;
    for (const split of splits) {
      await insertExpenseSplit(
        expense_id,
        split.user_id,
        split.amount,
        split.is_paid,
      );
    }
    console.log(`Expense with id: ${expense_id} created successfully`);
    res.status(200).json(expense);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(`Error creating expense`);
  }
}

export async function getExpenseSplits(req, res) {
  try {
    const expense_id = req.params.expense_id;
    const expense_splits = await fetchExpenseSplits(expense_id);
    res.status(200).json(expense_splits);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteExpenseById(req, res) {
  try {
    const expense_id = req.params.expense_id;
    await deleteExpense(expense_id);
    res.status(200).json(`Expense with id: ${expense_id} deleted successfully`);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function settleExpenseById(req, res) {
  try {
    const expense_id = req.params.expense_id;
    const expense = await settleExpense(expense_id);
    res.status(200).json(expense);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function settleExpenseSplitById(req, res) {
  try {
    const split_id = req.params.split_id;
    const split = await settleExpenseSplit(split_id);
    res.status(200).json(split);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
