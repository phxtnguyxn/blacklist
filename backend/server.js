const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const db = require('./config/db');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));


app.use(session({
  secret: 'lgevh009851',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.use(bodyParser.json());


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/blacklist', require('./routes/blacklist.routes'));
app.use('/api/logs', require('./routes/logs.routes'));


const frontendPath = path.join(__dirname, '../frontend/dist/frontend');
app.use(express.static(frontendPath));


app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
