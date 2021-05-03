const app = require("./app");
const cors = require("cors")
const port = process.env.PORT;
app.use(cors());

app.listen(port, () => {
  console.log(`Sever running in  port: ${port}`);
});
