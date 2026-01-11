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

export async function selectUserById(user_id) {
  const { data: profileData, error } = await supabase.from("user_profile").select("*");
  
  console.log("Profile Data:", profileData);

  const { data: authData, error: authError } = await supabase.auth.admin.getUserById(user_id);

  console.log("Auth Data:", authData);

  if (error) throw new Error(error.message);
  if(authError) throw new Error(authError.message);
  return {
    ...profileData[0],
    email: authData.user.email,
  };
}

export async function updateUser(id, username, avatar_url) {
  const updatePayload = {};
  if (username !== undefined) updatePayload.username = username;
  if (avatar_url !== undefined) updatePayload.avatar_url = avatar_url;
  if (Object.keys(updatePayload).length === 0) {
    throw new Error("No fields provided to update");
  }
  const { error } = await supabase
    .from("user_profile")
    .update(updatePayload)
    .eq("id", id)
  if (error) throw new Error(error.message);
}

export async function deleteAuthUser(userId) {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}