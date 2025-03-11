const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log('🛠️ Debug Login Request:', username, password);

    try {
        const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
        if (rows.length === 0) {
            console.log('❌ Không tìm thấy username!');
            return res.status(401).json({ message: 'Sai username hoặc password!' });
        }

        const user = rows[0];
        if (password !== user.password) {
            console.log('❌ Sai password!');
            return res.status(401).json({ message: 'Sai username hoặc password!' });
        }

        console.log('✅ Đăng nhập thành công!', user);
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Đăng nhập thành công!', token });
    } catch (err) {
        console.error('❌ Lỗi SQL:', err);
        return res.status(500).json({ message: 'Lỗi server', error: err });
    }
};