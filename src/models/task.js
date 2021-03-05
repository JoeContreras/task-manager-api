const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
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

/*
taskSchema.pre("save", async function (next) {
  const task = this;

  if (task.isModified("password")) {
    task.password = await bcrypt.hash(task.password, 8);
  }

  next();
});

*/

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
