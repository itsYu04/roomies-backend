import express from "express";
import {
  createNewTask,
  deleteTaskById,
  getTaskById,
  getTasksByHouse,
  getCompletedHouseTasksByUser,
  markTaskAsDone,
  updateTaskData,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/:task_id", getTaskById);
router.get("/house/:house_id", getTasksByHouse);
router.get("/:house_id/user/:user_id", getCompletedHouseTasksByUser);
router.post("/", createNewTask);
router.put("/:task_id", updateTaskData);
router.put("/done/:task_id", markTaskAsDone);
router.delete("/:task_id", deleteTaskById);

export default router;
