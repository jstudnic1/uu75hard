const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const taskDao = require("../../dao/task-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
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
          completed: { type: "boolean" }, // No default value specified here; handled in code
          goal: { type: "string" }
        },
      }
    }
  },
  required: ["id", "tasks"],
  additionalProperties: false
};

async function UpdateAbl(req, res) {
  try {
    let task = req.body;

    // validate input
    const valid = ajv.validate(schema, task);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedTask = taskDao.update(task);
    if (!updatedTask) {
      res.status(404).json({
        code: "userNotFound",
        message: `User ${task.id} not found`,
      });
      return;
    }

    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
