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

// exports.searchBlacklist = (req, res) => {
//     const { cccd, fullname } = req.body;
//     if (!cccd && !fullname) {
//         return res.status(400).json({ message: "Vui lòng nhập CCCD hoặc fullname để tìm kiếm!" });
//     }

//     Blacklist.searchBlacklist( cccd, fullname, (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         if (result.length === 0 || !result) {
//             return res.status(404).json({ message: 'Blacklist not found!' });
//         }
//         res.json(result[0]);
//     });
// };

exports.searchBlacklist = (req, res) => {
    const { cccd, fullname } = req.body;
    const checked_by_id = parseInt(req.params.id, 10); // Ép kiểu sang số nguyên

    if (!cccd && !fullname) {
        return res.status(400).json({ message: "Vui lòng nhập CCCD hoặc fullname để tìm kiếm!" });
    }

    if (isNaN(checked_by_id)) {
        return res.status(400).json({ message: "ID người kiểm tra không hợp lệ!" });
    }

    Blacklist.searchBlacklist(cccd, fullname, checked_by_id, (err, result) => {
        if (err) {
            console.error("Error searching blacklist: ", err);
            return res.status(500).json({ message: "Lỗi máy chủ!" });
        }
        res.json({ success: true, result });
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