import supabase from "../config/supabase.js";

export async function insertNotification(
  message,
  notification_type,
  user_id,
  house_id,
) {
  const { data, error } = await supabase
    .from("notifications")
    .insert([{ message, notification_type, user_id, house_id }])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchUserNotifications(user_id) {
  const { data, error } = await supabase
    .from("notifications")
    .select()
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchUserLastNotification(user_id) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteNotification(notification_id) {
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notification_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAllUserNotifications(user_id) {
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", user_id);
  if (error) throw new Error(error.message);
  return data;
}
