const Ajv = require("ajv");
const ajv = new Ajv();
const taskDao = require("../../dao/task-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    const reqParams = req.query?.id ? req.query : req.body;

    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const task = taskDao.get(reqParams.id);
    if (!task) {
      res.status(404).json({
        code: "taskNotFound",
        message: `Task ${reqParams.id} not found`,
      });
      return;
    }

    res.json(task);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
