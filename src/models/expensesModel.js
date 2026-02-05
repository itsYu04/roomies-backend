import supabase from "../config/supabase.js";

async function addSplitUsernames(expense_splits) {
  const userIds = [...new Set(expense_splits.map((s) => s.user_id))].filter(
    Boolean,
  );

  console.log(userIds);

  if (userIds.length === 0) return expense_splits;

  const { data: users, error } = await supabase
    .from("user_profile")
    .select("id, username")
    .in("id", userIds);

  if (error) throw new Error(error.message);

  const usersById = Object.fromEntries(
    (users || []).map((u) => [u.id, u.username]),
  );

  return expense_splits.map((s) => ({
    ...s,
    username: usersById[s.user_id] ?? null,
  }));
}

export async function fetchHouseExpenses(house_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, expense_splits(*)")
    .eq("house_id", house_id);
  if (error) throw new Error(error.message);

  if (!data || data.length === 0) return data;

  const withUsernames = await Promise.all(
    data.map(async (expense) => {
      if (expense.expense_splits && expense.expense_splits.length > 0) {
        expense.expense_splits = await addSplitUsernames(
          expense.expense_splits,
        );
      }
      return expense;
    }),
  );

  return withUsernames;
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

export async function deleteExpense(expense_id) {
  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expense_id);
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

export async function settleExpense(expense_id) {
  const updatePayload = {};
  updatePayload.is_paid = true;
  const { data, error } = await supabase
    .from("expense_splits")
    .update(updatePayload)
    .select()
    .eq("expense_id", expense_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function settleExpenseSplit(expense_split_id) {
  const updatePayload = {};
  updatePayload.is_paid = true;
  const { data, error } = await supabase
    .from("expense_splits")
    .update(updatePayload)
    .select()
    .eq("id", expense_split_id);
  if (error) throw new Error(error.message);
  return data;
}
