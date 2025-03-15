const db = require("../config/db");
const bcrypt = require("bcryptjs");

const AuthService = {
    login: (username, password, callback) => {
        db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(new Error("User not found!"));

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return callback(err);
                if (!isMatch) return callback(new Error("Invalid credentials"));

                callback(null, user);
            });
        });
    }
};

module.exports = AuthService;
