// In addAbl.js
const taskDao = require('../../dao/task-dao.js');

const AddAbl = async (req, res) => {
  try {
    const dayTaskId = req.params.id; // Changed to match the expected parameter in the URL
    const newTask = req.body;

    // Basic validation
    if (!newTask.name) {
      res.status(400).json({ message: "Task name is required" });
      return;
    }

    // Add the task
    const addedTask = taskDao.add(dayTaskId, newTask);
    res.json(addedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = AddAbl;
