const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const db = require('./config/db');

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200", // hoặc domain thực tế
    credentials: true, // Cho phép gửi cookie
  })
);


app.use(
  session({
    secret: "Lgevh@2025",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Đặt thành true nếu dùng HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 ngày
    },
  })
);


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
