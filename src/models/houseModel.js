import supabase from "../config/supabase";

export async function fetchUserHouses(user_id) {
    const user_id = params;
    const {data, error} = await supabase
    .from("user_house")
    .eq("user_id", user_id)
    .select();
    if (error) throw new Error(error.message);
    return data;
}

export async function fetchHouseById(house_id) {
    const {data, error} = await supabase
    .from("house")
    .eq("id", house_id)
    .select();
    if (error) throw new Error(error.message);
    return data;
}

export async function insertHouse(id, name, address, user_id){
    const { data, error } = await supabase
    .from("house")
    .insert([{ id, name, address, user_id }])
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