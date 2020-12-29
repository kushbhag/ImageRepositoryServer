const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const Image = require("../models/image");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now().toLocaleString()+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/JPG') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post("/", authenticateToken, upload.single('imageUpload'), (req, res, next) => {
    const image = new Image ({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        path: req.file.path,
        public: req.body.public,
        userId: req.body.userId
    });
    image.save().then(result =>{
        // console.log(result);
        res.status(200).json({
            message: 'POST image',
            savedImage: image
        });
    }).catch(err => {
        // console.log(err);
        res.status(500).json({error: err});
    });
});

router.get("/", (req, res, next) => {
    Image.find({ public: true })
        .exec()
        .then(images => {
            const response = {
                count: images.length,
                images: images.map(image => {
                  return {
                    name: image.name,
                    path: image.path,
                    public: image.public,
                    _id: image._id,
                    userId: image.userId,
                    request: {
                      type: "GET",
                      url: "/image/"
                    }
                  };
                })
              };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.get("/:imageId", (req, res, next) => {
    const id = req.params.imageId;
    Image.findById(id)
        .exec()
        .then(image => {
            // console.log(image);
            if (image) {
                res.status(200).json({
                    image: image,
                    request: {
                        type: "GET",
                        url: "/image/" + image._id
                    }
                });
            } else {
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err =>{
            // console.error(err);
            res.status(500).json({error: err});
        });
});

router.get("/user/:userId", authenticateToken, (req, res, next) => {
    const id = req.params.userId;
    Image.find({ userId: id })
        .exec()
        .then(images => {
            const response = {
                count: images.length,
                images: images.map(image => {
                  return {
                    name: image.name,
                    path: image.path,
                    public: image.public,
                    _id: image._id,
                    userId: image.userId,
                    request: {
                      type: "GET",
                      url: "/image/"
                    }
                  };
                })
              };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.delete("/:imageId", authenticateToken, (req, res, next) => {
    const imageId = req.params.imageId;
    Image.findById(imageId)
        .exec()
        .then(image => {
            if (req.user._id != image.userId) return res.status(401).send();
            Image.deleteOne({
                _id: imageId
            }).exec()
              .then(r => {
                  fs.unlinkSync(image.path);
                  res.status(200).json(r)
              })
              .catch(err => {
                  console.log(err);
                  res.status(500).json({error: err});
              });
        })
    
});

function authenticateToken(req, res, next) {
    const header = req.headers['authorization'];
    const token =  header && header.split(' ')[1];
    if (token == null) return res.status(401).send();

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.status(403).send();
        req.user = user;
        next();
    });
}

module.exports = router;