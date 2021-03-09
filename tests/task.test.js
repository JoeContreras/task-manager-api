const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const {
  userOne,
  userTwo,
  userTwoId,
  taskOne,
  userOneId,
  setupDataBase,
} = require("./fixtures/db");

beforeEach(setupDataBase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "dishes",
    })
    .expect(201);

  //  Assert that the database was changed correctly
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
  expect(task.owner).toEqual(userOneId);
});

test("Get tasks that belong to user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //  check array length
  expect(response.body.length).toEqual(2);
});

test("Second user should not be allowed to delete first task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  //  check if task is still in database
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
