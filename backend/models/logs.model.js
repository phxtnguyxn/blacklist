const db = require('../config/db');

const Logs = {
    getFullLogs: ( callback ) => {
        db.query('select * from logs', callback);
    },

    getLogsWithConditions: ( startDate, endDate, callback ) => {
        db.query('select * from logs where checked_at between ? and ?', 
            [startDate, endDate], callback);
    },
};

module.exports = Logs;