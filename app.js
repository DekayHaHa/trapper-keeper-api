import express from 'express';
import shortid from 'shortid';
import cors from 'cors';
// imports
const app = express();
app.use(express.json());
// setup for using node express
app.use(cors());
// allows for communication via cors

app.locals.notes = [];
// mock server

app.get('/api/notes', (req, res) => {
  res.status(200).json(app.locals.notes);
  // grabs req for all notes and responds with 200 status and all notes
});

app.get('/api/notes/:id', (req, res) => {
  // grabs specific note by id
  const { id } = req.params;
  // breaks down req params to id variable
  const { notes } = app.locals;
  // breaks down app.locals to notes variable
  const note = notes.find(note => note.id === id);
  // finds specific id in notes
  if (!note) return res.sendStatus(404);
  // if its not found app.js responds with a 404
  res.status(200).json(note);
  // if found it sends the note with a 200 status
});

app.post('/api/notes', (req, res) => {
  // creates new note to save
  const { title, itemsList } = req.body;
  // breaks down req.body into title and itemslist variables
  const id = shortid.generate();
  // id will now generate and id via shortid
  const newNote = { id, title, itemsList };
  // creates new object/note 
  if (!id || !title) return res.status(422).json({ error: 'Error posting note.' });
  // will not post or save note with invaild id or title, responds with a 422 status and error msg
  app.locals.notes.push(newNote);
  // adds newNote to app.locals
  res.status(201).json(newNote);
  // when successful responds with 201 status and the newNote
});

app.put('/api/notes/:id', (req, res) => {
  // updates existing note
  const { id } = req.params;
  // breaks down req.params to id variable
  const note = req.body;
  // assigns note to the result of req.body
  const noteIdx = app.locals.notes.findIndex(note => note.id == id);
  // checks to see if note does exist
  if (noteIdx === -1) return res.status(404).json('Note not found.');
  // if note does not app responds with 404 status and a not found msg
  app.locals.notes.splice(noteIdx, 1, note);
  // replaces old note with new note via splice and ind
  return res.status(200).json(app.locals.notes[noteIdx]);
  // responds with 200 status and the updated note
});

app.patch('/api/notes', (req, res) => {
  // plz ignore
  app.locals.notes = req.body;
});

app.delete('/api/notes/:id', (req, res) => {
  // finds and deletes note via id
  const { id } = req.params;
  // breaks down req.params to id variable
  const { notes } = app.locals;
  // breaks down app.locals to notes variable
  const noteIdx = notes.findIndex(note => note.id == id);
  // checks to see if note does exist
  if (noteIdx === -1) return res.status(404).json('Note not found.');
  // if note does not app responds with 404 status and a not found msg
  notes.splice(noteIdx, 1);
  // removes note from app.locals via splace and ind
  return res.sendStatus(204);
  // app responds with 204 status via happy path
});

export default app;
// exports app for use in server