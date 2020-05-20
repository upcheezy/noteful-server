const express = require('express')
const xss = require('xss')
const NotesService = require('./note-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.name),
  note_content: xss(note.content),
  date_created: note.date_created,
  folder_id: note.folder_id,
})

notesRouter
  .route('/')
  .get((req, res, next) => {
    // console.log(res)
    NotesService.getAllNotes(
        req.app.get('db')
      )
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {
      note_name,
      note_content,
      folder_id
    } = req.body
    const newNote = {
      note_name,
      note_content,
      folder_id
    }

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body`
          }
        })
      }
    }
    
    NotesService.insertNote(
        req.app.get('db'),
        newNote
      )
      .then(note => {
        res
          .status(201)
          .location(`/notes/${note.id}`)
          .json(serializeNote(note))
      })
      .catch(next)
  })

// articlesRouter
//   .route('/:article_id')
//   .get((req, res, next) => {
//     const knexInstance = req.app.get('db')
//     ArticlesService.getById(knexInstance, req.params.article_id)
//       .then(article => {
//         if (!article) {
//           return res.status(404).json({
//             error: {
//               message: `Article doesn't exist`
//             }
//           })
//         }
//         res.json({
//           id: article.id,
//           style: article.style,
//           title: xss(article.title),
//           content: xss(article.content),
//           date_published: article.date_published,
//           author: article.author
//         })
//       })
//       .catch(next)
//   })
//   .delete((req, res, next) => {
//     ArticlesService.deleteArticle(
//         req.app.get('db'),
//         req.params.article_id
//       )
//       .then(() => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })

module.exports = notesRouter