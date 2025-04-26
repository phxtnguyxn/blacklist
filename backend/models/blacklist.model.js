const db = require('../config/db');

const Blacklist = {
    
    getBlacklist: (callback) => {
        db.query('SELECT * FROM blacklist', callback);
    },

    // searchBlacklist: (cccd, fullname, callback) => {
    //     let query = `SELECT blacklist.id, blacklist.cccd, blacklist.fullname, blacklist.company, 
    //                         blacklist.violation, blacklist.penalty_start, blacklist.penalty_end, 
    //                         users.fullname AS created_person, blacklist.created_at, blacklist.note 
    //                  FROM blacklist 
    //                  LEFT JOIN users ON users.id = blacklist.created_by`;
        
    //     let conditions = [];
    //     let values = [];
    
    //     // Nếu có CCCD, thêm điều kiện
    //     if (cccd) {
    //         conditions.push("blacklist.cccd = ?");
    //         values.push(cccd);
    //     }
    
    //     // Nếu có fullname, thêm điều kiện
    //     if (fullname) {
    //         conditions.push("blacklist.fullname LIKE ?");
    //         values.push(`%${fullname}%`);
    //     }
    
    //     // Nếu có ít nhất một điều kiện, thêm WHERE vào query
    //     if (conditions.length > 0) {
    //         query += " WHERE " + conditions.join(" AND ");
    //     }
    
    //     db.query(query, values, callback);
    // },

    // addBlacklist: (userBlacklist, callback) => {
    //     const { cccd, fullname, company, violation, penalty_start, penalty_end, created_by, note } = userBlacklist; 
    //     db.query(
    //         'select min(t1.id + 1) as lost_id from blacklist t1 left join blacklist t2 on t1.id + 1 = t2.id where t2.id is null',
    //     (err, result) => {
    //         if (err) {
    //             return callback(err);
    //         }

    //         let lost_Id = result[0].lost_id || null;
    //         const insertQuery = lost_Id
    //         ? `INSERT INTO blacklist (id, cccd, fullname, company, violation, penalty_start, penalty_end, created_by, note) VALUES (?,?,?,?,?,?,?,?,?)`
    //         : 'INSERT INTO blacklist (cccd, fullname, company, violation, penalty_start, penalty_end, created_by, note) VALUES (?,?,?,?,?,?,?,?)';

    //         const values = lost_Id
    //         ? [lost_Id, cccd, fullname, company, violation, penalty_start, penalty_end, created_by, note]
    //         : [cccd, fullname, company, violation, penalty_start, penalty_end, created_by, note];
            
    //         db.query(insertQuery, values, callback);
    //     });
    // },

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