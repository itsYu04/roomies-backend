import express from "express";
import {
  getAllUsers,
  createUser,
  updateUserData,
  deleteUser,
  getUserById,
  uploadProfilePic,
  setDefaultHouse,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:user_id", getUserById);
router.put("/:user_id", updateUserData);
router.put("/default/:user_id", setDefaultHouse);
router.put("/profile_pic/:user_id", uploadProfilePic);
router.delete("/:user_id", deleteUser);

export default router;
