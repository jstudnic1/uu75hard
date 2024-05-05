// In /abl/user/loginAbl.js
const userDao = require('../../dao/user-dao');
const taskDao = require('../../dao/task-dao'); // Make sure to require your taskDao
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');  // Useful for handling dates
const { use } = require('../../controller/task-controller');

const LoginAbl = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = userDao.getByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Retrieve tasks for the user for today
        const today = dayjs().format('YYYYMMDD');
        const tasks = taskDao.getTasksForUserAndDate(user.id, today) || 'No tasks for today';

        // Here you would normally create a session or token
        res.json({
            message: "Login successful",
			username: user.username,
            userId: user.id,
			streakdays: user.streakdays,
            tasks: tasks  // Include tasks in the login response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = LoginAbl;
