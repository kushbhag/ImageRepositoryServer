const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        if (await User.findOne({ username: req.body.username }).exec() !== null) {
            return res.status(401).send("User already exists");
        }
        const hashedPw = await bcrypt.hash(req.body.password, 10);
        const user = new User ({
            _id: new mongoose.Types.ObjectId,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPw,
        });
        user.save().then(result =>{
            // console.log(result);
            res.status(200).json({
                message: 'POST new user',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    _id: user._id
                }
            });
        }).catch(err => {
            // console.log(err);
            res.status(500).json({error: err});
        });
    } catch {
        res.status(501).send();
    }
});

router.post("/login", async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (user === null) {
        return res.status(404).send("User cannot be found");
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(201).json({
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            });
        } else {
            res.status(401).send("Invalid Password")
        }
    } catch {
        res.status(500).send();
    }
});

router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName
                    },
                    request: {
                        type: "GET",
                        url: "/user/" + id
                    }
                });
            } else {
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

module.exports = router;