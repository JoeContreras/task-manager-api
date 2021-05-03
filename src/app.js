const express = require("express");
const cors = require("cors")
require("./db/mongoose-db");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(cors());

module.exports = app;
