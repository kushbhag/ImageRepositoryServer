const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    path: { type: String, required: true},
    name: { type: String, required: true},
    price: { type: Number, required: true}
});

module.exports = mongoose.model('Image', imageSchema);