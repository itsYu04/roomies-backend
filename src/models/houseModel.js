import supabase from "../config/supabase.js";

export async function fetchUserHouses(user_id) {
    const {data, error} = await supabase
    .from("user_house")
    .select()
    .eq("user_id", user_id);
    if (error) throw new Error(error.message);
    return data;
}

export async function fetchHouses(house_ids) {
    const {data, error} = await supabase
    .from("house")
    .select()
    .in("id", house_ids);
    if (error) throw new Error(error.message);
    return data;
}

export async function fetchHouseById(house_id) {
    const {data, error} = await supabase
    .from("house")
    .select()
    .eq("id", house_id);
    if (error) throw new Error(error.message);
    return data;
}

export async function insertHouse(name, address, user_id){
    const { data, error } = await supabase
    .from("house")
    .insert([{ name, address, user_id }])
    .select();
    if (error) throw new Error(error.message);
    return data[0];
}

export async function insertHouseUserRelation(user_id, house_id, role='member', stared=false){
    const { data, error } = await supabase
    .from("user_house")
    .insert([{ user_id, house_id, role, stared}])
    .select();
    if (error) throw new Error(error.message);
    return data[0];
}