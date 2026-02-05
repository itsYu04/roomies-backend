import express from "express";
import {
  createNotification,
  deleteAllNotificationsByUserId,
  deleteNotificationById,
  getUserNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:user_id", getUserNotification);
router.post("/", createNotification);
router.delete("/:user_id", deleteAllNotificationsByUserId);
router.delete("/single/:notification_id", deleteNotificationById);

export default router;
