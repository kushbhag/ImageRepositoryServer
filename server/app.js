const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
    'mongodb://localhost/image-repository',
    {
        useNewUrlParser: true
    }
);

const app = express();
app.use('/images/', express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const imageRouter = require("./api/routes/image");

app.use('/image', imageRouter);

module.exports = app;