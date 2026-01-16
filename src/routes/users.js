import express from "express";
import {
  getAllUsers,
  createUser,
  updateUserData,
  deleteUser,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:user_id", getUserById);
router.put("/:user_id", updateUserData);
router.delete("/:id", deleteUser);

export default router;
