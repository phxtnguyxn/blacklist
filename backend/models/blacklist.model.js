const db = require('../config/db');

const Blacklist = {
    
    getBlacklist: (callback) => {
        db.query('SELECT * FROM blacklist', callback);
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

    updateBlacklist: (blacklistId, userBlacklist, callback) => {
        userBlacklist = userBlacklist || {};

        db.query('select * from blacklist where id = ?', [blacklistId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (results.length === 0) {
                callback(new Error('Blacklist not found!'), null);
                return;
            }

            const existingBlacklist = results[0];
            const updateBlacklist = {
                id: userBlacklist.id || existingBlacklist.id,
                cccd: userBlacklist.cccd || existingBlacklist.cccd,
                fullname: userBlacklist.fullname || existingBlacklist.fullname,
                company: userBlacklist.company || existingBlacklist.company,
                violation: userBlacklist.violation || existingBlacklist.violation,
                penalty_start: userBlacklist.penalty_start || existingBlacklist.penalty_start,
                penalty_end: userBlacklist.penalty_end || existingBlacklist.penalty_end,
                created_by: userBlacklist.created_by || existingBlacklist.created_by,
                note: userBlacklist.note || existingBlacklist.note,
            };

            db.query(
                "update blacklist set cccd = ?, fullname = ?, company = ?, violation = ?, penalty_start = ?, penalty_end = ?, created_by = ?, note = ? where id = ?",
                [
                    updateBlacklist.cccd,
                    updateBlacklist.fullname,
                    updateBlacklist.company,
                    updateBlacklist.violation,
                    updateBlacklist.penalty_start,
                    updateBlacklist.penalty_end,
                    updateBlacklist.created_by,
                    updateBlacklist.note,
                    blacklistId,
                ],
                (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    callback(null, { id: blacklistId, ...updateBlacklist });
                }
            );
        });
    },

    deleteBlacklist: (blacklistId, callback) => {
        db.query('DELETE FROM blacklist WHERE id = ?', [blacklistId], callback);
    },
};

module.exports = Blacklist;