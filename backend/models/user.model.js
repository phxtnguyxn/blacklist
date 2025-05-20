const db = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
    getAllUsers: (callback) => {
        db.query("SELECT * FROM users", callback);
    },

    getUserById: (id, callback) => {
        db.query("SELECT * FROM users WHERE id = ?", [id], callback);
    },

    getUserRole: (callback) => {
        db.query("SELECT DISTINCT role FROM users", callback);
    },    
    
    getUserByUsername: (username, callback) => {
        db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.length > 0 ? results[0] : null);
        });
    },

    createUser: (newUser, callback) => {
        const { username, password, fullname, role } = newUser;

        // Mã hóa mật khẩu trước khi lưu
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return callback(err);
            }

            db.query(
                "SELECT MIN(t1.id + 1) AS lost_id FROM users t1 LEFT JOIN users t2 ON t1.id + 1 = t2.id WHERE t2.id IS NULL",
                (err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    let lost_Id = result[0].lost_id || null;

                    const insertQuery = lost_Id
                        ? "INSERT INTO users (id, username, password, fullname, role) VALUES (?, ?, ?, ?, ?);"
                        : "INSERT INTO users (username, password, fullname, role) VALUES (?, ?, ?, ?);";

                    const values = lost_Id
                        ? [lost_Id, username, hashedPassword, fullname, role]
                        : [username, hashedPassword, fullname, role];

                    db.query(insertQuery, values, callback);
                }
            );
        });
    },

    updateUser: (id, userData, callback) => {
        db.query(
            "UPDATE users SET username = ?, password = ?, fullname = ?, role = ? WHERE id = ?",
            [userData.username, userData.password, userData.fullname, userData.role, id],
            callback
        );
    },
    
    deleteUser: (userId, callback) => {
        db.query("DELETE FROM users WHERE id = ?", [userId], callback);
    },
};

module.exports = User;
