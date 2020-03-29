const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const sessionRouter = require('./routes/sessionRouter');

dotenv.config({ path: './config.env' });

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);

module.exports = app;
