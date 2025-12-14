import supabase from "../config/supabase.js";

export async function fetchAllUsers() {
  const { data, error } = await supabase.from("user_profile").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function insertUser(id, username, avatar_url) {
  const { data, error } = await supabase
    .from("user_profile")
    .insert([{ id, username, avatar_url }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}


export async function deleteAuthUser(userId) {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}