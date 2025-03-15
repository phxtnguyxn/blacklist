const AuthService = require("../services/auth.services");

exports.login = (req, res) => {
    const { username, password } = req.body;

    AuthService.login(username, password, (err, user) => {
        if (err) return res.status(401).json({ message: err.message });
        if (!req.session) {
            return res.status(500).json({ message: "Session is not initialized" });
        }

        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.json({ message: "Login successful", user: req.session.user });
    });
};

exports.checkLogin = (req, res) => {
    if (req.session.user) {
        return res.json({ isAuthenticated: true, user: req.session.user });
    }
    res.json({ isAuthenticated: false });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully" });
    });
};
