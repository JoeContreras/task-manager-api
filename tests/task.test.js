const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const {
  userOne,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
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

test("Should not create task with invalid completed state", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "test",
      completed: 40,
    })
    .expect(400);
});

test("Should not update task with invalid description", async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "",
      completed: true,
    })
    .expect(404);
});

test("Should delete user task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //  check if task is still in database
  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test("Should not delete task task if unauthenticated", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);

  //  check if task is still in database
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should not update other user tasks", async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "wash car",
      completed: true,
    })
    .expect(404);

  //  check if task is still in database
  const task = await Task.findById(taskOne._id);
  expect(task.description).toEqual("First task");
});

test("Should not fetch user task if unauthenticated", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);
});

test("Should not fetch other users task", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

test("Should fetch only completed tasks", async () => {
  const response = await request(app)
    .get(`/tasks?completed=true`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should fetch only completed tasks", async () => {
  const response = await request(app)
    .get(`/tasks?completed=false`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should sort tasks by creation date", async () => {
  const response = await request(app)
    .get(`/tasks?createdAt=desc`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should fetch page of tasks", async () => {
  const response = await request(app)
    .get(`/tasks?limit=5?skip=5`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});
