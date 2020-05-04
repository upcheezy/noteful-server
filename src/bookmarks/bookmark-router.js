const express = require('express')
const {
    v4: uuid
} = require('uuid');
const logger = require('../logger');
const { bookmarks } = require('../store')

const bookRouter = express.Router()
const bodyParser = express.json()

bookRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const {
            description,
            rating, 
            title,
            url
        } = req.body;

        if (!description) {
            logger.error(`description is required`);
            return res
                .status(400)
                .send('invalid data')
        }

        if (!rating) {
            logger.error(`rating is required`);
            return res
                .status(400) 
                .send('invalid data')
        }

        if (!title) {
            logger.error('title is required')
            return res
                .status(400)
                .send('invalid data')
        }

        if (!url) {
            logger.error('url is required')
            return res
                .status(400)
                .send('invalid data')
        }

        const id = uuid();

        const bookmark = {
            id,
            description,
            rating,
            title,
            url
        };

        bookmarks.push(bookmark);

        logger.info(`card with id ${id} created`)

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark);
    })

bookRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const id = req.params;
        const bookmark = bookmarks.find(b => b.id == id.id);

        if (!bookmark) {
            logger.error(`bookmark with id ${id} not found`);
            return res
                .status(404)
                .send('bookmark not found')
        };

        res.json(bookmark);
    })
    .delete((req, res) => {
        const {
            id
        } = req.params;

        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

        if (bookmarkIndex === -1) {
            logger.error(`card with id ${id} not found`);
            return res
            .status(404)
            .send('not found')
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`bookmark with id ${id} deleted.`);

        res
            .status(204)
            .end();

    })

module.exports = bookRouter;