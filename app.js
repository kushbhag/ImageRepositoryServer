const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(
    "mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@image-respository.bivcf.mongodb.net/image-repository?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);

const app = express();

app.use('/images/', express.static('images'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const imageRouter = require("./api/routes/image");
const userRouter = require("./api/routes/user");
const authRouter = require("./api/routes/auth");

app.use('/image', imageRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

module.exports = app;