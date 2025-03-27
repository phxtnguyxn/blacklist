const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// require('dotenv').config();
const db = require('./config/db');
const session = require('express-session');

const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

app.use(session({
  secret: 'lgevh009851', // Thay bằng secret key của bạn
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Để `false` nếu không dùng HTTPS
}));

app.use(bodyParser.json());

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const blacklistRoutes = require('./routes/blacklist.routes');
app.use('/api/blacklist', blacklistRoutes);

const logsRoutes = require('./routes/logs.routes');
app.use('/api/logs', logsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});