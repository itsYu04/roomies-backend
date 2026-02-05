import supabase from "../config/supabase.js";

export async function insertNotification(
  message,
  notification_type,
  user_id,
  house_id,
) {
  const { data, error } = await supabase
    .from("notification")
    .insert([{ message, notification_type, user_id, house_id }])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchUserNotifications(user_id) {
  const { data, error } = await supabase
    .from("notification")
    .select()
    .eq("user_id", user_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteNotification(notification_id) {
  const { data, error } = await supabase
    .from("notification")
    .delete()
    .eq("id", notification_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAllUserNotifications(user_id) {
  const { data, error } = await supabase
    .from("notification")
    .delete()
    .eq("user_id", user_id);
  if (error) throw new Error(error.message);
  return data;
}
