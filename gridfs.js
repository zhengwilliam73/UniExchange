//Made by Jacky Jiang

const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const dbURI = "mongodb+srv://zhengwilliam73_db_user:1yok67HMYsyQCA9x@uniexchange-cluster.fbmonai.mongodb.net/?appName=uniexchange-cluster";

const storage = new GridFsStorage({
  url: dbURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        resolve({
          filename: buf.toString('hex') + path.extname(file.originalname),
          bucketName: 'images'
        });
      });
    });
  }
});

module.exports = multer({ storage });
