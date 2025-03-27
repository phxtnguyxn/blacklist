const Logs = require('../models/logs.model');

exports.getFullLogs = (req, res) => {
    Logs.getFullLogs((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getFilteredLogs = (req, res) => {
    const { startDate, endDate } = req.body;
    Logs.getLogsWithConditions(startDate, endDate, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};