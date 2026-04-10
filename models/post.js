const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema( {
    author: {
    type: String,
    required: true
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId // Made by William Zheng, 1/30
    },
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
    categories: {
        type: [String],
        default: []
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
