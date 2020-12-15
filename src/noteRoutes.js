const express = require('express');
const router = express.Router();
const NoteServices = require('./noteServices');
const xss = require('xss');
router.use(express.json());

const serializeNote = (Note) => ({
  id: Note.id,
  name: xss(Note.name),
  modified: Note.modified,
  folderId: Note.folderId,
  content: xss(Note.content)
});


router
  .route('/')
  .get((req, res, next) => {
    NoteServices
      .getAllNotes(req.app.get('db'))
      .then((Notes) => {
        res.json(Notes.map(serializeNote));
      })
      .catch(next);
  })
  .post((req, res) => {
    let { name, folderId, content } = req.body;
    if (!name) {
      return res.status(400).send('Name is required');
    }
    if (!folderId) {
      return res.status(400).send('A folder is required mannnn');
    }
    if (!content) {
      return res.status(400).send(`You need content, Ya basic!`);
    }
    let newNote = {
      name,
      folderId,
      content

    };
    NoteServices
      .insertNote(req.app.get('db'), newNote)
      .then((Note) => {
        res.status(201)
          .location(`http://localhost/Notes${Note.id}`)
          .json(Note);
      });
  });

router
  .route('/:id')
  .all((req, res, next) => {
    NoteServices.getNoteById(req.app.get('db'), req.params.id)
      .then((Note) => {
        if (!Note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          });
        }
        res.Note = Note; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(
      serializeNote(res.Note)
    )
  })
  .delete((req, res, next) => {
    NoteServices.deleteNote(req.app.get('db'), req.params.id)
      .then((Note) => {
        return res.status(204)
          .end();
        
      })

      .catch(next);
  })

module.exports = router;