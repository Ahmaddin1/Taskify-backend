import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { task, desc, deadline } = req.body;

    if (!task || !desc || !deadline) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (deadline <= Date.now()) {
      return res
        .status(400)
        .json({ message: "Deadline must be in the future." });
    }

    const newTask = await Task.create({
      task,
      desc,
      deadline,
      userId: req.user.id,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { task, desc, deadline, warned30Min } = req.body;

    if (deadline && deadline <= Date.now()) {
      return res
        .status(400)
        .json({ message: "Deadline must be in the future." });
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { task, desc, deadline, warned30Min },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};
