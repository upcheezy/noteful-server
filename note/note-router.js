const express = require('express')
const xss = require('xss')
const NotesService = require('./note-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  note_content: xss(note.note_content),
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

notesRouter
  .route('/:note_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getById(knexInstance, req.params.note_id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: {
              message: `Note doesn't exist`
            }
          })
        }
        res.json({
          id: note.id,
          note_name: xss(note.note_name),
          note_content: xss(note.note_content),
          date_created: note.date_created,
          folder_id: note.folder_id
        })
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(
        req.app.get('db'),
        req.params.note_id
      )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter