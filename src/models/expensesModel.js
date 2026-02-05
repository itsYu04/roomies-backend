import supabase from "../config/supabase.js";

export async function fetchHouseExpenses(house_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, expense_splits(*)")
    .eq("house_id", house_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchHouseTotalBalance(house_id) {
  // get_house_total_balance is a function defined in the database
  const { data, error } = await supabase.rpc("get_house_total_balance", {
    house_id,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchUserTotalBalanceByHouse(house_id, user_id) {
  // get_user_total_balance is a function defined in the database
  const { data, error } = await supabase.rpc("get_user_total_balance", {
    p_house_id: house_id,
    p_user_id: user_id,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function insertExpense(
  house_id,
  title,
  total_amount,
  paid_by,
  split_type,
  expense_type,
) {
  const { data, error } = await supabase
    .from("expenses")
    .insert([
      { house_id, title, total_amount, paid_by, split_type, expense_type },
    ])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertExpenseSplit(expense_id, user_id, amount, is_paid) {
  const { data, error } = await supabase
    .from("expense_splits")
    .insert([{ expense_id, user_id, amount, is_paid }])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchExpenseSplits(expense_id) {
  const { data, error } = await supabase
    .from("expense_splits")
    .select()
    .eq("expense_id", expense_id);
  if (error) throw new Error(error.message);
  return data;
}
