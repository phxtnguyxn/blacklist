const Blacklist = require('../models/blacklist.model');

exports.getBlacklist = (req, res) => {
    Blacklist.getBlacklist((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.addBlacklist = (req, res) => {
    const newBlacklist = req.body;
    Blacklist.addBlacklist(newBlacklist, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Blacklist added successfully!', CCCD: results.insertId, newBlacklist });
    });
}; 

exports.searchBlacklist = (req, res) => {
    const { cccd, fullname } = req.body;
    if (!cccd && !fullname) {
        return res.status(400).json({ message: "Vui lòng nhập CCCD hoặc fullname để tìm kiếm!" });
    }

    Blacklist.searchBlacklist( cccd, fullname, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0 || !result) {
            return res.status(404).json({ message: 'Blacklist not found!' });
        }
        res.json(result[0]);
    });
};

exports.updateBlacklist = (req, res) => {
    const blacklistId = req.params.id;
    const updatedBlacklist = req.body;
    Blacklist.updateBlacklist(blacklistId, updatedBlacklist, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Blacklist updated!', blacklistId, updatedBlacklist });
    });
};

exports.deleteBlacklist = (req, res) => {
    const blacklistId = req.params.id;
    Blacklist.deleteBlacklist(blacklistId, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Blacklist deleted!', blacklistId });
    });

};