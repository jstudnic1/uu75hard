// In /abl/task/deleteAbl.js
const taskDao = require('../../dao/task-dao.js');

const DeleteAbl = async (req, res) => {
    const taskId = req.params.id; // Assuming the task list ID is passed in the URL
    const taskName = req.body.name; // The name of the task to delete

    try {
        const updatedTasks = taskDao.deleteTask(taskId, taskName);
        res.json({
            message: "Task deleted successfully",
            tasks: updatedTasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = DeleteAbl;
