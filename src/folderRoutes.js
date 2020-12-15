const express = require('express');
const router = express.Router();
const folderServices = require('./folderServices');
const xss = require('xss');
router.use(express.json());

const serializeFolder = (folder) => ({
  id: folder.id,
  name: xss(folder.name)
});


router
  .route('/')
  .get((req, res, next) => {
    folderServices
      .getAllFolders(req.app.get('db'))
      .then((folders) => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post((req, res) => {
    let { name } = req.body;
    if (!name) {
      return res.status(400).send('Name is required');
    }
    let newFolder = {
      name
    };
    folderServices
      .insertFolder(req.app.get('db'), newFolder)
      .then((folder) => {
        res.status(201)
          .location(`http://localhost/folders${folder.id}`)
          .json(folder);
      });
  });

router
  .route('/:id')
  .all((req, res, next) => {
    folderServices.getFolderById(req.app.get('db'), req.params.id)
      .then((folder) => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
          });
        }
        res.folder = folder; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(
      serializeFolder(res.folder)
    )
  })
  .delete((req, res, next) => {
    folderServices.deleteFolder(req.app.get('db'), req.params.id)
      .then(() => res.status (204).end())
      .catch(next);
  })

module.exports = router;