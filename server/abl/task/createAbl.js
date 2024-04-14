const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const taskDao = require("../../dao/task-dao.js");
const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    userId: { type: "string" }, // Link to the user
    tasks: {
      type: "array",
      minItems: 0, // Allows the tasks array to be empty
      items: {
        type: "object",
        properties: {
          taskId: { type: "string" },
          name: { type: "string" },
          completed: { type: "boolean"},
          goal: { type: "string" },
        },
        required: ["taskId"],
        additionalProperties: false,
      },
    },
  },
  required: ["date", "userId", "tasks"],
  additionalProperties: false,
};

async function createAbl(req, res) {
  try {
    let task = req.body;

    const valid = ajv.validate(schema, task);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    task.tasks.forEach((t) => {
      if (t.completed === undefined) {
        t.completed = false; // Default completion status
      }
    });

    const userList = userDao.list();
    const userExists = userList.some((u) => u.id === task.userId);
    if (!userExists) {
      res.status(400).json({
        code: "userDoesntExists",
        message: `User does not exist`,
      });
      return;
    }
    task = taskDao.create(task);
    res.json(task);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = createAbl;
