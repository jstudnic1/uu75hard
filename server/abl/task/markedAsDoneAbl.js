const Ajv = require("ajv");
const ajv = new Ajv();

const taskDao = require("../../dao/task-dao.js");

// Adjusted schema: only validating the taskName now
const schema = {
  type: "object",
  properties: {
    name: { type: "string" }
  },
  required: ["name"]
};

async function MarkedAsDoneAbl(req, res) {
  try {
    const dayTaskId = req.params.id;  // Get the dayTaskId from the URL parameters
    const { name } = req.body;    // Destructure the taskName from the request body

    // Validate the taskName input
    const valid = ajv.validate(schema, { name });
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedTaskList = taskDao.markTaskAsDone(dayTaskId, name);
    if (!updatedTaskList) {
      res.status(404).json({
        code: "taskNotFound",
        message: "Task not found or already marked as completed",
      });
      return;
    }

    res.json(updatedTaskList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = MarkedAsDoneAbl;
