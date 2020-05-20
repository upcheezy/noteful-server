const express = require('express')
const xss = require('xss')
const FoldersService = require('./folder-service')

const folderRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    name: xss(folder.folder_name),
    date_published: folder.date_published,
})

folderRouter
    .route('/')
    .get((req, res, next) => {
        // console.log(res)
        FoldersService.getAllFolders(
                req.app.get('db')
            )
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {
            folder_name,
        } = req.body
        const newFolder = {
            folder_name,
        }

        for (const [key, value] of Object.entries(newFolder)) {
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }

        FoldersService.insertFolder(
                req.app.get('db'),
                newFolder
            )
            .then(folder => {
                res
                    .status(201)
                    .location(`/folders/${folder.id}`)
                    .json(serializeFolder(folder))
            })
            .catch(next)
    })

folderRouter
    .route('/:folder_id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FoldersService.getById(knexInstance, req.params.folder_id)
            .then(folder => {
                if (!folder) {
                    return res.status(404).json({
                        error: {
                            message: `Folder doesn't exist`
                        }
                    })
                }
                res.json({
                    id: folder.id,
                    folder_name: xss(folder.folder_name),
                    date_published: folder.date_published,
                })
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
                req.app.get('db'),
                req.params.folder_id
            )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = folderRouter