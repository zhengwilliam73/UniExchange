const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Post = require('./models/post');

// express app
const app = express();

app.listen(3001)