const express = require("express");
const cors = require("cors")

require("./db/mongoose-db");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


module.exports = app;
