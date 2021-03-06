const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
// GET /tasks?completed=true||false
// GET /tasks?limit=5?skip=5
// GET /tasks?sortBy=createdAt:desc(asc)
router.get(
  "/tasks",
  auth,
  async ({ query: { completed, limit, skip, sortBy }, user }, res) => {
    const match = {};
    const sort = {};
    if (completed) {
      match.completed = completed === "true";
    }

    if (sortBy) {
      const parts = sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    try {
      // also works
      // const tasks = await Task.find({ owner: req.user._id });
      await user
        .populate({
          path: "tasks",
          match,
          options: {
            limit: parseInt(limit),
            skip: parseInt(skip),
            sort,
          },
        })
        .execPopulate();
      res.send(user.tasks);
    } catch (e) {
      res.status(404).send(e);
    }
  }
);

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    /*
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
    */
    res.send(task);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
