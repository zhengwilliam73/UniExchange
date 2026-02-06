const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Post = require('./models/post');
const upload = require('./gridfs');
const { GridFSBucket } = require('mongodb');



// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://zhengwilliam73_db_user:1yok67HMYsyQCA9x@uniexchange-cluster.fbmonai.mongodb.net/?appName=uniexchange-cluster";

mongoose.connect(dbURI)
  .then(() => app.listen(3001))
  .catch(err => console.log(err));

//Written by Jacky Jiang
let bucket;

mongoose.connection.once('open', () => {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'images'
  });
});

//Written by Jacky Jiang
app.get('/image/:id', (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  bucket.openDownloadStream(id).pipe(res);
});


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));


//register view engine, this is for ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Home'});
});

app.get('/hub', (req, res) => {
    Post.find().sort( {createdAt: -1})
        .then((result) => {
            res.render('hub', {title: 'All Posts', posts: result})
        })
        .catch((err) => {
            console.log(err);
        })
});

//Updated by Jacky Jiang
app.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');
    if (!bucket) return res.status(500).send('GridFS not ready');

    const uploadFile = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
          contentType: req.file.mimetype
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on('error', reject);

        uploadStream.on('finish', () => {
          resolve(uploadStream.id);
        });
      });
    };

    const fileId = await uploadFile();

    const post = new Post({
      imageId: fileId, 
      title: req.body.title,
      description: req.body.description,
      condition: req.body.condition,
      price: req.body.price,
      location: req.body.location
    });

    await post.save();
    res.redirect('/hub');

  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});



app.get('/post', (req, res) => {
    res.render('post', { title: 'Post'});
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us'});
});

app.get('/blog', (req, res) => {
    res.render('blog', { title: 'Blogs'});
});



app.get('/support', (req, res) => {
    res.render('support', { title: 'Support'});
});





app.get('/:id', (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('404', { title: 'Post not found' });
    }

    Post.findById(id)
        .then(result => {
            if (!result) {
                return res.status(404).render('404', { title: 'Post not found' });
            }
            res.render('details', { post: result, title: 'Post Details' });
        })
        .catch(err => console.log(err));
});

app.get('/posts/:id/edit', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.render('edit', {
        title: 'Edit Post',
        post: post
      });
    })
    .catch(err => {
      console.log(err);
    });
});

//made by Frank 2/6/26. This route receives edited form, finds the post by ID, and updates MongoDB. The user
// is sent back to the details page
app.post('/posts/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Post.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
      condition: req.body.condition,
      price: req.body.price,
      location: req.body.location
    });

    res.redirect(`/${id}`);
  } catch (err) {
    console.log(err);
  }
});




app.delete('/:id', (req, res) => {
    const id = req.params.id;

    Post.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/hub'})
        })
        .catch(err => {
            console.log(err);
        })
})


// 404 page
app.use((req, res) => {
    res.render('404', { title: '404!'});
    res.status(404);
});

