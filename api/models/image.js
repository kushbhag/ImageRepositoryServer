const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    path: { type: String, required: true},
    name: { type: String, required: true},
    userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Images', imageSchema);