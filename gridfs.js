//Made by Jacky Jiang

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

module.exports = upload;
