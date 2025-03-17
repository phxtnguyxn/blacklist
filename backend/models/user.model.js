const db = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
    getAllUsers: (callback) => {
        db.query("SELECT * FROM users", callback);
    },

    getUserById: (userName, callback) => {
        db.query("SELECT * FROM users WHERE username = ?", [userName], callback);
    },
    
    getUserByUsername: (username, callback) => {
        db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.length > 0 ? results[0] : null);
        });
    },

    createUser: (userData, callback) => {
        const { username, password, fullname, role } = userData;

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

    updateUser: (userId, userData, callback) => {
        db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(new Error("User not found!"), null);

            const existingUser = results[0];
            const updateUser = {
                username: userData.username || existingUser.username,
                fullname: userData.fullname || existingUser.fullname,
                role: userData.role || existingUser.role,
            };

            // Kiểm tra nếu người dùng nhập mật khẩu mới, thực hiện mã hóa
            if (userData.password) {
                bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
                    if (err) return callback(err, null);
                    updateUser.password = hashedPassword;
                    updateUserInDB(userId, updateUser, callback);
                });
            } else {
                updateUser.password = existingUser.password; // Giữ nguyên mật khẩu cũ nếu không thay đổi
                updateUserInDB(userId, updateUser, callback);
            }
        });

        function updateUserInDB(userId, updateUser, callback) {
            db.query(
                "UPDATE users SET username = ?, password = ?, fullname = ?, role = ? WHERE id = ?",
                [updateUser.username, updateUser.password, updateUser.fullname, updateUser.role, userId],
                (error, results) => {
                    if (error) return callback(error, null);
                    callback(null, { id: userId, ...updateUser });
                }
            );
        }
    },

    deleteUser: (userId, callback) => {
        db.query("DELETE FROM users WHERE id = ?", [userId], callback);
    },
};

module.exports = User;
