const db = require('../config/db');

const Blacklist = {
    
    getBlacklist: (callback) => {
        db.query('select blacklist.id, blacklist.cccd, blacklist.fullname, blacklist.company, blacklist.violation, blacklist.penalty_start, blacklist.penalty_end, users.username as creator, blacklist.note from blacklist left join users on blacklist.created_by = users.id', callback);
        // db.query('SELECT * FROM blacklist', callback);
    },

    getUserIdByUsername: (username, callback) => {
        db.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
            if (err || results.length === 0) return callback(err || new Error('User not found'), null);
            callback(null, results[0].id);
        });
    },    

    searchBlacklist: (cccd, fullname, checked_by_id, callback) => {
        db.query(
            'CALL search_blacklist(?, ?, ?)',
            [cccd || '', fullname || '', checked_by_id],
            (err, results) => {
                if (err) return callback(err, null);

                // Trả về mảng kết quả đầu tiên nếu có
                callback(null, results[0] || []);
            }
        );
    },

    updateBlacklist: (blacklistId, username, userBlacklist, callback) => {
        Blacklist.getUserIdByUsername(username, (err, userId) => {
            if (err) return callback(err);
    
            db.query('SELECT * FROM blacklist WHERE id = ?', [blacklistId], (err, results) => {
                if (err) return callback(err);
                if (results.length === 0) return callback(new Error('Blacklist not found!'));
    
                const existingBlacklist = results[0];
                const updateBlacklist = {
                    cccd: userBlacklist.cccd ?? existingBlacklist.cccd,
                    fullname: userBlacklist.fullname ?? existingBlacklist.fullname,
                    company: userBlacklist.company ?? existingBlacklist.company,
                    violation: userBlacklist.violation ?? existingBlacklist.violation,
                    penalty_start: userBlacklist.penalty_start !== undefined ? userBlacklist.penalty_start : existingBlacklist.penalty_start,
                    penalty_end: userBlacklist.penalty_end !== undefined ? userBlacklist.penalty_end : existingBlacklist.penalty_end,
                    note: userBlacklist.note ?? existingBlacklist.note
                };
    
                db.query(
                    "UPDATE blacklist SET cccd = ?, fullname = ?, company = ?, violation = ?, penalty_start = ?, penalty_end = ?, created_by = ?, note = ? WHERE id = ?",
                    [
                        updateBlacklist.cccd,
                        updateBlacklist.fullname,
                        updateBlacklist.company,
                        updateBlacklist.violation,
                        updateBlacklist.penalty_start,
                        updateBlacklist.penalty_end,
                        userId,
                        updateBlacklist.note,
                        blacklistId
                    ],
                    (error) => {
                        if (error) return callback(error);
                        callback(null, { id: blacklistId, ...updateBlacklist });
                    }
                );
            });
        });
    },
    

    deleteBlacklist: (blacklistId, callback) => {
        db.query('DELETE FROM blacklist WHERE id = ?', [blacklistId], callback);
    },

    addBlacklist: (newBlacklist, username, callback) => {
        Blacklist.getUserIdByUsername(username, (err, user) => {
            if (err) return callback(err);
    
            db.query(
                'INSERT INTO blacklist (cccd, fullname, company, violation, penalty_start, penalty_end, created_by, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    newBlacklist.cccd,
                    newBlacklist.fullname,
                    newBlacklist.company,
                    newBlacklist.violation,
                    newBlacklist.penalty_start,
                    newBlacklist.penalty_end,
                    user,
                    newBlacklist.note
                ],
                callback
            );
        });
    },
    
};

module.exports = Blacklist;