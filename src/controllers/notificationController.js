import {
  deleteAllUserNotifications,
  deleteNotification,
  fetchUserLastNotification,
  fetchUserNotifications,
  insertNotification,
} from "../models/notificationsModel.js";

export async function getUserNotification(req, res) {
  try {
    const user_id = req.params.user_id;
    const notifications = await fetchUserNotifications(user_id);
    res.status(200).json(notifications);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getUserLastNotification(req, res) {
  try {
    const user_id = req.params.user_id;
    const notification = await fetchUserLastNotification(user_id);
    res.status(200).json(notification);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function createNotification(req, res) {
  try {
    const { message, notification_type, user_id, house_id } = req.body;
    const notification = await insertNotification(
      message,
      notification_type,
      user_id,
      house_id,
    );
    res.status(201).json(notification);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteAllNotificationsByUserId(req, res) {
  try {
    const user_id = req.params.user_id;
    await deleteAllUserNotifications(user_id);
    res.status(200).json(`All notifications deleted successfully`);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteNotificationById(req, res) {
  try {
    const notification_id = req.params.notification_id;
    await deleteNotification(notification_id);
    res
      .status(200)
      .json(`Notifications with id: ${notification_id} deleted successfully`);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
