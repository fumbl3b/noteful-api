const folderService = {

  getAllFolders(db) {
    return db.select('*').from('folders');
  },

  insertFolder(db, newFolder) {
    return db('folders')
      .insert(newFolder)
      .returning('*')
      .then((folder) => {
        return folder[0];
      });
  },

  getFolderById(db, id) {
    return db('folders').select('*').where('id', id).first();
  },

  deleteFolder(db, id) {
    return db('folders').where({ id }).delete();
  },
  
};

module.exports = folderService;
