import express from "express";
import {
  createNewTask,
  deleteTaskById,
  getTaskById,
  getTasksByHouse,
  markTaskAsDone,
  updateTaskData,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/:task_id", getTaskById);
router.get("/house/:house_id/:is_done", getTasksByHouse);
router.post("/", createNewTask);
router.put("/:task_id", updateTaskData);
router.put("/done/:task_id", markTaskAsDone);
router.delete("/:task_id", deleteTaskById);

export default router;
