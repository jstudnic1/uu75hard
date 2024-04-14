const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const userController = require("./controller/user-controller");
const taskController = require("./controller/task-controller");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userController);
app.use("/task", taskController);

app.listen(port, () => {
  console.log("Server is listening on port 3000");
});
