require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {
    NODE_ENV,
    API_TOKEN
} = require('./config');
const winston = require('winston');
const notesRouter = require('../note/note-router')
const foldersRouter = require('../folder/folder-router')

const app = express();

const morganOption = (NODE_ENV === 'production') ?
    'tiny' :
    'common';

// console.log(process.env.NOTEFUL_SERVER_API_KEY)

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'info.log'
        })
    ]
});

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use('/notes', notesRouter)
app.use('/folders', foldersRouter)

app.use(function errorHandler(error, req, res, next) {
    response = {
        message: error.message,
        error
    }
    res.status(500).json(response);
})

app.use(function validateBearerToken(req, res, next) {
    const apiToken = API_TOKEN;
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(401).json({
            error: 'Unauthorized request'
        })
    }
    // move to the next middleware
    next()
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

module.exports = app