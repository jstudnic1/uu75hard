const Ajv = require("ajv");
const ajv = new Ajv();
const bcrypt = require('bcryptjs'); // Using bcryptjs which is a pure JS implementation of bcrypt
const saltRounds = 10;

const userDao = require("../../dao/user-dao.js");

const schema = {
	type: "object",
	properties: {
	  id: { type: "string" },
	  username: { type: "string" },
	  email: { type: "string" },
	  password: { type: "string" },
	  profile: {
		type: "object",
		properties: {
		  fullName: { type: "string" },
		  gender: { type: "string" },
		  StreakDays: { type: "integer", default: 0 }  // Assuming this is a non-negative number
		},
	  }
	},
	required: ["username", "email", "password"],
	additionalProperties: false
  };

async function createAbl(req, res) {
  try {
    let user = req.body;

    const valid = ajv.validate(schema, user);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.passwordHash = hashedPassword; // Storing hashed password
    delete user.password; // Remove plaintext password from user object

    const userList = userDao.list();
    const emailExists = userList.some((u) => u.email === user.email);
    if (emailExists) {
      res.status(400).json({
        code: "emailAlreadyExists",
        message: `User with email ${user.email} already exists`,
      });
      return;
    }

    user = userDao.create(user);
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = createAbl;
