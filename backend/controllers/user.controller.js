const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getUserRole = (req, res) => {
    User.getUserRole((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // chỉ cần trả dữ liệu
    });
};


exports.getUserById = (req, res) => {
    const userId = req.params.id;
    User.getUserById( userId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.json(results);
    });
};

exports.createUser = (req, res) => {
    const newUser = req.body;
    User.createUser( newUser, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({message: 'User created!', userId: results.insertId, newUser });
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedUser = { ...req.body };

    User.getUserById(userId, (err, currentUser) => {
        if (err || !currentUser) {
            return res.status(500).json({ error: 'User not found' });
        }

        // Nếu không thay đổi password, giữ nguyên
        if (
            !updatedUser.password || 
            updatedUser.password.trim() === '' || 
            updatedUser.password === currentUser.password
        ) {
            delete updatedUser.password;
        } else {
            // Nếu mật khẩu thay đổi, mã hóa lại
            const saltRounds = 10;
            updatedUser.password = bcrypt.hashSync(updatedUser.password, saltRounds);
        }

        User.updateUser(userId, updatedUser, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User updated!', userId });
        });
    });
};


exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    User.deleteUser( userId, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User deleted!', userId });
    });
};