import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Task name cannot be empty"],
      maxlength: [100, "Task name cannot exceed 100 characters"],
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    deadline: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > Date.now();
        },
        message: "Deadline must be in the future",
      },
    },
    warned30Min: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
