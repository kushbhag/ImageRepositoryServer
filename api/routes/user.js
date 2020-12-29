const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Refresh = require("../models/refresh");

const router = express.Router();

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