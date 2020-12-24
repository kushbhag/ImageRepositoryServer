const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');


const router = express.Router();
const Image = require("../models/image");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/JPG') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: storage});



router.post("/", upload.single('imageUpload'), (req, res, next) => {
    const image = new Image ({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        path: req.file.path,
        price: req.body.price
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
    Image.find()
        .select('name price path')
        .exec()
        .then(images => {
            const response = {
                count: images.length,
                images: images.map(image => {
                  return {
                    name: image.name,
                    price: image.price,
                    path: image.path,
                    _id: image._id,
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
        .select('name price path')
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

router.delete("/:imageId", (req, res, next) => {
    const id = req.params.imageId;
    Image.remove({
        _id: id
    }).exec()
      .then(r => res.status(200).json(r))
      .catch(err => {
          console.log(err);
          res.status(500).json({error: err});
      });
});

module.exports = router;