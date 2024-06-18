var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware สำหรับตรวจสอบและแปลง JWT
const verifyToken = (req, res, next) => {
    // เช็คว่ามี JWT ใน header หรือไม่
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token invalid' });
            } else {
                // ถ้าถูกต้องให้เก็บข้อมูลผู้ใช้ใน req.user
                req.user = decoded;
                next(); // ไปทำต่อไป
            }
        });
    } else {
        // ถ้าไม่มี token ส่งมาใน header ให้ส่งผู้ใช้ไปที่หน้า login
        res.redirect('/login'); // หรือใช้ res.sendFile('/path/to/login.html'); หรือวิธีการใดก็ได้ที่เหมาะสม
    }
};

module.exports = app;
