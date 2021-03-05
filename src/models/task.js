const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
  description: {
    required: true,
    trim: true,
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Task;
