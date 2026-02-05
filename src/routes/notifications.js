import express from "express";
import {
  createNotification,
  deleteAllNotificationsByUserId,
  deleteNotificationById,
  getUserLastNotification,
  getUserNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:user_id", getUserNotification);
router.get("/last/:user_id", getUserLastNotification);
router.post("/", createNotification);
router.delete("/:user_id", deleteAllNotificationsByUserId);
router.delete("/single/:notification_id", deleteNotificationById);

export default router;
