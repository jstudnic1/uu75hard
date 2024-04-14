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


module.exports = {
  create,
  get,
  list,
  update,
};
