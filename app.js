const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@image-respository.bivcf.mongodb.net/image-repository?retryWrites=true&w=majority",
    {
        useNewUrlParser: true
    }
);

const app = express();
app.use('/images/', express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const imageRouter = require("./api/routes/image");

app.use('/image', imageRouter);

module.exports = app;