const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Refresh = require("../models/refresh");

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
            res.status(200).send();
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
            const payload = generatePayload(user);
            const message = {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    _id: user._id
                },
                accessToken: generateAccessToken(payload),
                refreshToken: generateRefreshToken(payload)
            }
            const refreshToken = new Refresh({
                refreshToken: message.refreshToken
            });
            refreshToken.save()
                .then(result => {
                    res.status(201).json(message);
                })
                .catch(err => {
                    // console.log(err);
                    return res.status(500).json({error: err});
                });
        } else {
            res.status(401).send("Invalid Password")
        }
    } catch {
        res.status(500).send();
    }
});

router.post("/token", (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === null) return res.status(401).send("No refresh token send");
    Refresh.findOne({refreshToken: refreshToken})
            .exec()
            .then(token => {
                if (token) {
                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
                        if (err) return res.status(403).send("Error validating refresh token");
                        const accessToken = generateAccessToken(generatePayload(user));
                        return res.json({ accessToken: accessToken });
                    });
                } else {
                    return res.status(403).send("Invalid refresh token");
                }
            })
});

router.delete("/logout/:refreshToken", (req, res, next) => {
    const refreshToken = req.params.refreshToken;
    Refresh.deleteOne({ refreshToken: refreshToken })
            .exec()
            .then(t => {
                return res.status(202).send();
            })
            .catch(err => {
                res.status(500).json({error: err});
            })
})

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '30m' });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN);
}

function generatePayload(user) {
    return {
        _id: user._id
    };
}

module.exports = router;