const noteService = {
  getAllNotes(db) {
    return db.select('*').from('notes');
  },
  insertNote(db, newNote) {
    return db('notes')
      .insert(newNote)
      .returning('*')
      .then((Note) => {
        return Note[0];
      });
  },

  getNoteById(db, id) {
    return db('notes').select('*').where('id', id).first();
  },

  deleteNote(db, id) {
    return db('notes').where({ id }).delete();
  },
};

module.exports = noteService;
