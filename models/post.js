const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema( {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    }
}, { timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;