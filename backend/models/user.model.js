const db = require('../config/db');

const User = {
    getAllUsers: (callback) => {
        db.query('SELECT * FROM users', callback);
    },

    getUserById: (userId, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [userId], callback);
    },

    createUser: (userData, callback) => {
        const { username, password, fullname, role } = userData;
        db.query(
            'select min(t1.id + 1) as lost_id from users t1 left join users t2 on t1.id + 1 = t2.id where t2.id is null',
        (err, result) => {
            if (err) {
                return callback(err);
            }
            let lost_Id = result[0].lost_id || null;

            const insertQuery = lost_Id 
                ? 'insert into users (id, username, password, fullname, role) values (?, ?, ?, ?, ?);'
                : 'insert into users (username, password, fullname, role) values (?, ?, ?, ?);';

            const values = lost_Id
                ? [lost_Id, username, password, fullname, role]
                : [username, password, fullname, role];

            db.query(insertQuery, values, callback);
        });
    },

    updateUser: (userId, userData, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (results.length === 0) {
                callback(new Error('User not found!'), null);
                return;
            }

            const existingUser = results[0];
            const updateUser = {
                username: userData.username || existingUser.username,
                password: userData.password || existingUser.password,
                fullname: userData.fullname || existingUser.fullname,
                role: userData.role || existingUser.role,
            };

            db.query(
                'UPDATE users SET username = ?, password = ?, fullname = ?, role = ? WHERE id = ?',
                [updateUser.username, updateUser.password, updateUser.fullname, updateUser.role, userId],
                (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    callback(null, { id: userId, ...updateUser });
                }
            );
        });
        
    },

    deleteUser: (userId, callback) => {
        db.query('DELETE FROM users WHERE id = ?', [userId], callback);
    },
};

module.exports = User;