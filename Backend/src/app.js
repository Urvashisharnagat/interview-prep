const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());

// 🎯 Smart Origin Validator (Allows localhost, production, AND all Vercel previews)
const allowedOrigins = [
    'http://localhost:5173',
    'https://interview-prep-nine-gilt.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // 1. Allow non-browser requests (Postman, server-to-server)
        if (!origin) return callback(null, true);

        // 2. Allow exact matches (Localhost & Main Vercel Domain)
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // 3. Allow ANY dynamic Vercel preview domain (*.vercel.app)
        if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicitly handle CORS preflight for all routes
app.options('*', cors());

const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;