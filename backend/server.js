const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// require('dotenv').config();
const db = require('./config/db');

const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));
app.use(bodyParser.json());

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const blacklistRoutes = require('./routes/blacklist.routes');
app.use('/api/blacklist', blacklistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});