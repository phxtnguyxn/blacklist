const User = require('../models/user.model');

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
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
    const updatedUser = req.body;
    User.updateUser( userId, updatedUser, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User updated!', userId, updatedUser });
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