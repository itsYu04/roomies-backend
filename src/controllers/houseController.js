import { fetchUserHouses } from "../models/houseModel.js"

export async function getHouseById(params) {
    try{
        const house_id = params.id;
        const house = await fetchHouseById(house_id);
        res.json(house);
    }catch(e){
        res.status(500).json({ error: error.message });
    }
}

export async function getHousesByUserId(params) {
    try{
        const user_id = params.id;
        const houses = await fetchUserHouses(user_id);
        res.json(houses);
    }catch(e){
        res.status(500).json({ error: error.message });
    }
}