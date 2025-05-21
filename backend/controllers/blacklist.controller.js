const Blacklist = require('../models/blacklist.model');

exports.getBlacklist = (req, res) => {
    Blacklist.getBlacklist((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.addBlacklist = (req, res) => {
    const newBlacklist = req.body;

    // Lấy ID người tạo từ token
    newBlacklist.created_by = req.user.id;

    Blacklist.addBlacklist(newBlacklist, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: '✅ Blacklist added successfully!',
            CCCD: results.insertId,
            newBlacklist
        });
    });
};



exports.searchBlacklist = (req, res) => {
    const { cccd, fullname } = req.body;
    const checked_by_id = parseInt(req.params.id, 10);

    // Kiểm tra dữ liệu đầu vào
    if (!cccd && !fullname) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập CCCD hoặc Họ tên để tìm kiếm.'
        });
    }

    if (isNaN(checked_by_id)) {
        return res.status(400).json({
            success: false,
            message: 'ID người kiểm tra không hợp lệ.'
        });
    }

    // Gọi hàm từ model
    Blacklist.searchBlacklist(cccd, fullname, checked_by_id, (err, result) => {
        if (err) {
            console.error('Lỗi khi tìm kiếm blacklist:', err);
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi máy chủ.'
            });
        }

        return res.status(200).json({
            success: true,
            result: result.length ? result : [{
                cccd: cccd || 'N/A',
                fullname: fullname || 'N/A',
                result: 'Allowed'
            }]
        });
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