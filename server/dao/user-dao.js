const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { error } = require("console");

const userFolderPath = path.join(__dirname, "storage", "userList");


function create(user) {
  try {
    user.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(userFolderPath, `${user.id}.json`);
    const fileData = JSON.stringify(user);
    fs.writeFileSync(filePath, fileData, "utf8");
    return user;
  } catch (error) {
    throw { code: "failedToCreateUser", message: error.message };
  }
}

function get(userId) {
	try {
	  const filePath = path.join(userFolderPath, `${userId}.json`);
	  const fileData = fs.readFileSync(filePath, "utf8");
	  return JSON.parse(fileData);
	} catch (e) {
		if (error.code == "ENOENT") return NULL;
		throw {code: "failedToReadUser", message: error.message };
	}
}

function list() {
  try {
    const files = fs.readdirSync(userFolderPath);
    const userList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(userFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return userList;
  } catch (error) {
    throw { code: "failedToListUsers", message: error.message };
  }
}

function update(user) {
  try {
    const currentUser = get(user.id);
    if (!currentUser) return null;
    const newUser = { ...currentUser, ...user };
    const filePath = path.join(userFolderPath, `${user.id}.json`);
    const fileData = JSON.stringify(newUser);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newUser;
  } catch (error) {
    throw { code: "failedToUpdateUser", message: error.message };
  }
}

function getByUsername(username) {
  try {
      const files = fs.readdirSync(userFolderPath);
      for (let file of files) {
          const filePath = path.join(userFolderPath, file);
          const fileData = fs.readFileSync(filePath, "utf8");
          const user = JSON.parse(fileData);
          if (user.username === username) {
              return user;
          }
      }
      return null; // Return null if no user found
  } catch (error) {
      console.error("Failed to read user by username:", error);
      throw { code: "failedToReadUser", message: error.message };
  }
}

module.exports = {
  create,
  get,
  list,
  update,
  getByUsername
};
