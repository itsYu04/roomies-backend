import {
  fetchAllUsers,
  insertUser,
  deleteAuthUser,
  updateUser,
  selectUserById,
  uploadUserProfileImage,
  updateDefaultHouse,
} from "../models/userModel.js";

export async function getAllUsers(req, res) {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getUserById(req, res) {
  try {
    const user_id = req.params.user_id;
    console.log(user_id);
    const user = await selectUserById(user_id);
    console.log("User", user);
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function createUser(req, res) {
  try {
    const { user_id, username, email, avatar_url } = req.body;
    console.log(`Creating user with username: ${username}`);
    const newUser = await insertUser(user_id, username, email, avatar_url);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateUserData(req, res) {
  try {
    const user_id = req.params.user_id;
    const { username, avatar_url } = req.body;
    console.log(`Updating user with username: ${username}`);
    const updatedUser = await updateUser(user_id, username, avatar_url);
    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function uploadProfilePic(req, res) {
  try {
    const user_id = req.params.user_id;
    const { avatar_url } = req.body;
    const updatedUser = uploadUserProfileImage(user_id, avatar_url);
    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const user_id = req.params.user_id;
    console.log(`Deleting user with ID: ${user_id}`);
    await deleteAuthUser(user_id);
    res
      .status(200)
      .json({ message: `User with ID ${user_id} deleted successfully.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function setDefaultHouse(req, res) {
  try {
    const user_id = req.params.user_id;
    const { house_id } = req.body;
    console.log(`Updating user default house to: ${house_id}`);
    await updateDefaultHouse(user_id, house_id);
    res
      .status(200)
      .json({ message: `Default house updated to: ${house_id} successfully.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
