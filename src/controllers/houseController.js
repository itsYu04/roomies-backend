import { fetchHouseById, fetchUserHouses, fetchHouses, insertHouse, insertHouseUserRelation, deleteHouse, deleteHouseUserRelation, fetchHouseMembers } from "../models/houseModel.js"

export async function getHouseById(req, res) {
    try{
        const house_id = req.params.id;
        const house = await fetchHouseById(house_id);
        res.json(house);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export async function getHousesByUserId(req, res) {
    try{
        const user_id = req.params.id;
        // Fetch user_house data
        const userHouses = await fetchUserHouses(user_id);
        // Extract house IDs
        const houseIds = userHouses.map((uh)=> uh.house_id);
        // Fetch house data
        const houseData = await fetchHouses(houseIds);
        const combinedData = userHouses.map((uh) => {
            const house = houseData.find((h) => h.id === uh.house_id);
            return {
                ...uh,
                ...house,
        };
    });
        res.json(combinedData);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export async function getHouseMembers(req,res) {
    try{
        const house_id = req.params.house_id;
        const house_members = await fetchHouseMembers(house_id);
        res.status(200).json(house_members);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export async function createHouse(req, res) {
    try{
        const { name, address, user_id} = req.body;
        const house = await insertHouse(name, address, user_id);
        const house_id = house.id
        const role = "owner";
        const stared = false;
        await insertHouseUserRelation(user_id, house_id, role, stared);
        res.status(200).json(house);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export async function addRoommate(req, res) {
    try{
        const house_id = req.params.house_id;
        const { user_id, role, stared } = req.body;
        await insertHouseUserRelation(user_id, house_id, role, stared);
        res.status(200).json({ message: `User with ID ${user_id} added successfully.` });
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export async function deleteRoommate(req, res) {
    try{
        const house_id = req.params.house_id;
        const user_id = req.params.user_id;
        await deleteHouseUserRelation(house_id, user_id);
        res.status(200).json({ message: `User with ID ${user_id} deleted successfully.` });
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export async function deleteHouseById(req, res) {
    try{
        const house_id = req.params.house_id;
        await deleteHouse(house_id);
        res.status(200).json({ message: `House with ID ${house_id} deleted successfully.` });
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}