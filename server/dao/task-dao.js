const fs = require("fs");
const path = require("path");
const { error } = require("console");

const taskFolderPath = path.join(__dirname, "storage", "taskList");

function create(dayTask) {
  try {
    dayTask.id = `${dayTask.date.replace(/-/g, "")}-${dayTask.userId}`; // Using date and userId to create a unique filename
    const filePath = path.join(taskFolderPath, `${dayTask.id}.json`);
    const fileData = JSON.stringify(dayTask, null, 2);  // Pretty print JSON for better readability
    fs.writeFileSync(filePath, fileData, "utf8");
    return dayTask;  // Returning the dayTask might include the new id which is useful for the client
  } catch (error) {
    console.error("Failed to create task:", error);
    throw { code: "failedToCreateTask", message: error.message };
  }
}

function get(dayTask) {
	try {
	  const filePath = path.join(taskFolderPath, `${dayTask}.json`);
	  const fileData = fs.readFileSync(filePath, "utf8");
	  return JSON.parse(fileData);
	} catch (e) {
		if (error.code == "ENOENT") return NULL;
		throw {code: "failedToReadUser", message: error.message };
	}
}

function list() {
  try {
    const files = fs.readdirSync(taskFolderPath);
    const taskList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(taskFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return taskList;
  } catch (error) {
    throw { code: "failedToListUsers", message: error.message };
  }
}

function update(task) {
  try {
    const currentTask = get(task.id);  // Make sure the get function is designed to handle task retrieval by ID
    if (!currentTask) return null;
    const updatedTask = { ...currentTask, ...task };
    const filePath = path.join(taskFolderPath, `${task.id}.json`);
    const fileData = JSON.stringify(updatedTask, null, 2);  // null and 2 arguments for pretty formatting
    fs.writeFileSync(filePath, fileData, 'utf8');
    return updatedTask;
  } catch (error) {
    throw { code: "failedToUpdateTask", message: error.message };
  }
}

const add = (dayTaskId, newTask) => {
  try {
    const dayTask = get(dayTaskId);
    if (!dayTask) throw new Error('Task list not found');

    // Generate a unique task ID based on existing tasks
    const newTaskId = `t${100 + dayTask.tasks.length + 1}`;
    newTask.taskId = newTaskId;
    newTask.completed = false; // New tasks default to not completed
    newTask.goal = newTask.goal || ""; // Ensure goal is set, even if empty

    // Add the new task to the tasks array
    dayTask.tasks.push(newTask);

    // Save the updated tasks back to the file
    const filePath = path.join(taskFolderPath, `${dayTask.id}.json`);
    const fileData = JSON.stringify(dayTask, null, 2);
    fs.writeFileSync(filePath, fileData, 'utf8');

    return newTask;
  } catch (error) {
    console.error("Failed to add new task:", error);
    throw { code: "failedToAddTask", message: error.message };
  }
};

function deleteTask(taskId, taskName) {
  try {
      const filePath = path.join(taskFolderPath, `${taskId}.json`);
      const dayTask = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Filter out the task by name
      dayTask.tasks = dayTask.tasks.filter(task => task.name !== taskName);

      // Save the updated task list
      fs.writeFileSync(filePath, JSON.stringify(dayTask, null, 2), 'utf8');
      return dayTask;
  } catch (error) {
      console.error("Failed to delete task:", error);
      throw { code: "failedToDeleteTask", message: error.message };
  }
}

// In task-dao.js

function getTasksForUserAndDate(userId, date) {
  const filePath = path.join(taskFolderPath, `${date}-${userId}.json`);

  // Check if the file exists
  const fileExists = fs.existsSync(filePath);

  if (!fileExists) {
      return null; // Returns null if no tasks file exists for the date
  }

  try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData);
  } catch (error) {
      console.error("Error reading tasks from file:", filePath, error);
      throw error;  // Re-throw the error after logging
  }
}
module.exports = {
  create,
  get,
  list,
  update,
  add,
  deleteTask,
  getTasksForUserAndDate
};
