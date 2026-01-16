import supabase from "../config/supabase.js";

export async function fetchHouseTasks(house_id) {
  const { data, error } = await supabase
    .from("tasks")
    .select()
    .eq("house_id", house_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchHouseTasksByUser(house_id, user_id) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("house_id", house_id)
    .eq("user_id", user_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchHouseTaskById(task_id) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", task_id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertHouseTask(
  house_id,
  title,
  description,
  assigned_to,
  due_date,
  is_done
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ house_id, title, description, assigned_to, due_date, is_done }]);
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTask(
  task_id,
  title,
  description,
  assigned_to,
  due_date,
  is_done
) {
  const updatePayload = Object.fromEntries(
    Object.entries({
      title,
      description,
      assigned_to,
      due_date,
      is_done,
    }).filter(([, v]) => v !== undefined)
  );
  if (Object.keys(updatePayload).length === 0) {
    throw new Error("No fields provided to update");
  }
  const { error } = await supabase
    .from("tasks")
    .update(updatePayload)
    .eq("id", task_id);
  if (error) throw new Error(error.message);
}

export async function deleteTask(task_id) {
  const { error } = await supabase.from("tasks").delete().eq("id", task_id);
  if (error) throw new Error(error.message);
}
