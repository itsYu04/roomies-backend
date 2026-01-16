import express from "express";
import {
  createNewTask,
  deleteTaskById,
  getTaskById,
  getTasksByHouse,
  getTasksByUser,
  updateTaskData,
} from "../controllers/taskController";

const router = express.Router();

router.get("/:task_id", getTaskById);
router.get("/house/:house_id", getTasksByHouse);
router.get("/user/:user_id", getTasksByUser);
router.post("/", createNewTask);
router.put("/:task_id", updateTaskData);
router.delete("/:task_id", deleteTaskById);

export default router;
