require("../src/db/mongoose-db");
const Task = require("../src/models/task");

/*
Task.findByIdAndDelete("603ee3ef2f4f93b85d3e1e22")
  .then((result) => {
    console.log(result);
    return Task.countDocuments({ completed: false });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.log(e);
  });
*/

const deleteTaskAndCount = async (id) => {
  const deleteTask = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("603ee3ef2f4f93b85d3e1e22")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
