const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Post = require('./models/post');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://zhengwilliam73_db_user:1yok67HMYsyQCA9x@uniexchange-cluster.fbmonai.mongodb.net/?appName=uniexchange-cluster";

mongoose.connect(dbURI)
  .then(result => app.listen(3001))
  .catch(err => console.log(err));


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));


//register view engine, this is for ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    Post.find().sort( {createdAt: -1})
        .then((result) => {
            res.render('index', {title: 'All Posts', posts: result})
        })
        .catch((err) => {
            console.log(err);
        })
});

app.post('/', (req, res) => {
    const post = new Post(req.body);

    post.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err)=> {
            console.log(err);
        })
})

app.get('/posts/:id', (req, res) => {
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

app.delete('/posts/:id', (req, res) => {
    const id = req.params.id;

    Post.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/'})
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/post', (req, res) => {
    res.render('post', { title: 'Post'});
});

// 404 page
app.use((req, res) => {
    res.render('404', { title: '404!'});
    res.status(404);
});