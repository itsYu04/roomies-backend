import {
  deleteTask,
  fetchHouseTaskById,
  fetchHouseTasks,
  fetchCompletedHouseTasksByUser,
  insertHouseTask,
  setTaskAsComplete,
  updateTask,
} from "../models/taskModel.js";

export async function getTasksByHouse(req, res) {
  try {
    const house_id = req.params.house_id;
    const tasks = await fetchHouseTasks(house_id);
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getCompletedHouseTasksByUser(req, res) {
  try {
    const house_id = req.params.house_id;
    const user_id = req.params.user_id;
    const tasks = await fetchCompletedHouseTasksByUser(house_id, user_id);
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getTaskById(req, res) {
  try {
    const task_id = req.params.task_id;
    const task = await fetchHouseTaskById(task_id);
    res.status(200).json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function createNewTask(req, res) {
  try {
    const {
      house_id,
      title,
      description,
      assigned_to,
      rotation,
      task_type,
      due_date,
    } = req.body;
    const is_done = false;
    const task = await insertHouseTask(
      house_id,
      title,
      description,
      assigned_to,
      due_date,
      rotation,
      task_type,
      is_done,
    );
    if (task) {
      console.log(task.id);
      res
        .status(200)
        .json({ message: `Task with ID ${task.id} created successfully.` });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateTaskData(req, res) {
  try {
    const task_id = req.params.task_id;
    const {
      house_id,
      title,
      description,
      assigned_to,
      due_date,
      rotation,
      is_done,
    } = req.body;
    console.log(`Updating task with id: ${task_id}`);
    const updatedTask = await updateTask(
      task_id,
      house_id,
      title,
      description,
      assigned_to,
      due_date,
      rotation,
      is_done,
    );
    res.status(200).json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function markTaskAsDone(req, res) {
  try {
    const task_id = req.params.task_id;
    const { task_image_url } = req.body;
    console.log(`Marking task with id: ${task_id} as complete`);
    const updatedTask = await setTaskAsComplete(task_id, task_image_url);
    res.status(200).json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteTaskById(req, res) {
  try {
    const task_id = req.params.task_id;
    console.log(`Deleting task with id: ${task_id}`);
    await deleteTask(task_id);
    res.status(200).json(`Task with id: ${task_id} deleted successfully`);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
