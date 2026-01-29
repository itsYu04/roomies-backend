import supabase from "../config/supabase.js";

export async function fetchUserHouses(user_id) {
  const { data, error } = await supabase
    .from("user_house")
    .select()
    .eq("user_id", user_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchHouseMembers(house_id) {
  const { data, error } = await supabase
    .from("user_house")
    .select("user_profile(*)")
    .eq("house_id", house_id);
  if (error) throw new Error(error.message);
  return (data || []).map((row) => row.user_profile);
}

export async function fetchHouses(house_ids) {
  const { data, error } = await supabase
    .from("house")
    .select()
    .in("id", house_ids);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchHouseById(house_id) {
  const { data, error } = await supabase
    .from("house")
    .select()
    .eq("id", house_id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertHouse(
  name,
  address,
  user_id,
  def_currency,
  def_rotation,
) {
  const { data, error } = await supabase
    .from("house")
    .insert([{ name, address, user_id, def_currency, def_rotation }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function insertHouseUserRelation(
  user_id,
  house_id,
  role = "member",
) {
  const { data, error } = await supabase
    .from("user_house")
    .insert([{ user_id, house_id, role }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function updateHouse(house_id, name, address) {
  const updatePayload = {};
  if (name !== undefined) updatePayload.name = name;
  if (address !== undefined) updatePayload.address = address;
  if (Object.keys(updatePayload).length === 0) {
    throw new Error("No fields provided to update");
  }
  const { error } = await supabase
    .from("house")
    .update(updatePayload)
    .eq("id", house_id);
  if (error) throw new Error(error.message);
}

export async function deleteHouseUserRelation(house_id, user_id) {
  const { error } = await supabase
    .from("user_house")
    .delete()
    .eq("house_id", house_id)
    .eq("user_id", user_id);
  if (error) throw new Error(error.message);
}

export async function deleteHouse(house_id) {
  const { error } = await supabase.from("house").delete().eq("id", house_id);
  if (error) throw new Error(error.message);
}
