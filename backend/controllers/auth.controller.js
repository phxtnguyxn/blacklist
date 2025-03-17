const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "❌ Vui lòng nhập đầy đủ thông tin!" });
    }

    User.getUserByUsername(username, (err, user) => {
        if (err) return res.status(500).json({ message: "❌ Lỗi server!", error: err });

        if (!user) return res.status(400).json({ message: "❌ Sai tài khoản hoặc mật khẩu!" });

        // Kiểm tra mật khẩu
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "❌ Lỗi server!", error: err });

            if (!isMatch) return res.status(400).json({ message: "❌ Sai tài khoản hoặc mật khẩu!" });

            // Tạo JWT Token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );

            res.json({ message: "✅ Đăng nhập thành công!", token });
        });
    });
};
