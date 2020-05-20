const express = require('express')
const xss = require('xss')
const NotesService = require('./note-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.name),
  content: xss(note.content),
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
//   .post(jsonParser, (req, res, next) => {
//     const {
//       title,
//       content,
//       style,
//       author
//     } = req.body
//     const newArticle = {
//       title,
//       content,
//       style
//     }

//     for (const [key, value] of Object.entries(newArticle)) {
//       if (value == null) {
//         return res.status(400).json({
//           error: {
//             message: `Missing '${key}' in request body`
//           }
//         })
//       }
//     }

//     newArticle.author = author
    
//     ArticlesService.insertArticle(
//         req.app.get('db'),
//         newArticle
//       )
//       .then(article => {
//         res
//           .status(201)
//           .location(`/articles/${article.id}`)
//           .json(serializeArticle(article))
//       })
//       .catch(next)
//   })

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