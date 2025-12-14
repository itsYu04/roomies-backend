import { fetchAllUsers, insertUser, deleteAuthUser } from "../models/userModel.js";

export async function getAllUsers(req, res) {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createUser(req, res) {
  try {
    const { user_id, username, avatar_url } = req.body;
    console.log("Params is",user_id)
    console.log("Body is ",req.body)
    console.log("Username is ", username)
    const newUser = await insertUser(user_id, username, avatar_url);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUser(req, res){
  try{
    const user_id = req.params.id;
    console.log(`Deleting user with ID: ${user_id}`);
    await deleteAuthUser(user_id)
    res.status(200).json({ message: `User with ID ${user_id} deleted successfully.` });
  }catch(error){
    res.status(500).json({error: error.message})
  }
}