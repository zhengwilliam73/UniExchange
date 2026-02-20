//File made by Frank 2/19

//Imports Mongoose
const mongoose = require('mongoose');

//Creates the Schema object
const Schema = mongoose.Schema;

//Defines User Schema

const userSchema = new Schema({
    username: {
       type: String,   //must be text
       required: true,   //MongoDB rejects the document if this field is missing
       unique: true         // No two users can have the same username
    },
    password: {
        type: String,
        required: true
    }

}, {timestamps: true}); //MongoDB adds createdAt and updatedAt which could be useful later

const User = mongoose.model('User', userSchema);
module.exports = User;

