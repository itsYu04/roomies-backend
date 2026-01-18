import supabase from "../config/supabase.js";
import { fetchHouseMembers } from "../models/houseModel.js";

export async function fetchHouseTasks(house_id) {
  const { data, error } = await supabase
    .from("tasks")
    .select()
    .eq("house_id", house_id)
    .eq("is_done", false); // Just show the tasks that aren't done
  if (error) throw new Error(error.message);

  const tasks = data || [];

  const assignedId = [...new Set(tasks.map((p) => p.assigned_to))].filter(
    Boolean
  );
  if (assignedId.length === 0) return tasks;

  const { data: users, error: usersError } = await supabase
    .from("user_profile")
    .select("id, username")
    .in("id", assignedId);

  if (usersError) throw new Error(usersError.message);

  const assignedById = Object.fromEntries(
    (users || []).map((c) => [c.id, c.username])
  );

  const withUsernames = tasks.map((p) => ({
    ...p,
    assigned_to_username: assignedById[p.assigned_to] ?? null,
  }));

  return withUsernames;
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
  rotation,
  task_type,
  is_done
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        house_id,
        title,
        description,
        assigned_to,
        due_date,
        rotation,
        task_type,
        is_done,
      },
    ])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTask(
  task_id,
  house_id,
  title,
  description,
  assigned_to,
  due_date,
  rotation,
  is_done
) {
  const updatePayload = Object.fromEntries(
    Object.entries({
      house_id,
      title,
      description,
      assigned_to,
      due_date,
      rotation,
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

export async function setTaskAsComplete(task_id, task_image_url) {
  // fetch task
  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", task_id)
    .single();

  if (error || !task) throw new Error(error?.message || "Task not found");

  const updatePayload = {};
  updatePayload.is_done = true;
  if (task_image_url !== undefined)
    updatePayload.task_image_url = task_image_url;
  // Mark task as done
  const { error: updateError } = await supabase
    .from("tasks")
    .update(updatePayload)
    .eq("id", task_id);

  if (updateError) throw new Error(updateError.message);

  if (task.rotation && task.rotation != "None") {
    const roommates = await fetchHouseMembers(task.house_id);

    console.log("Roommates:", roommates);

    const currentIndex = roommates.findIndex((r) => r.id === task.assigned_to);
    console.log("currentIndex is: ", currentIndex);
    if (roommates.length === 0) {
      throw new Error("No roommates found for rotation");
    }

    // if currentIndex not found, start from 0
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % roommates.length;
    console.log("Next user is:", roommates[nextIndex].id);

    let nextDueDate = new Date(task.due_date);
    if (task.rotation === "Daily")
      nextDueDate.setDate(nextDueDate.getDate() + 1);
    if (task.rotation === "Weekly")
      nextDueDate.setDate(nextDueDate.getDate() + 7);
    if (task.rotation === "Monthly")
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    const newTask = await insertHouseTask(
      task.house_id,
      task.title,
      task.description,
      roommates[nextIndex].id,
      nextDueDate.toISOString().split("T")[0],
      task.rotation,
      task.task_type,
      false
    );
    return { message: "Task completed and next task created", newTask };
  }
  return { message: "Task completed" };
}

export async function deleteTask(task_id) {
  const { error } = await supabase.from("tasks").delete().eq("id", task_id);
  if (error) throw new Error(error.message);
}
