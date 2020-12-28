const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
    district: { type: Schema.Types.ObjectId, ref: 'District', required: true },
    cats: { type: Schema.Types.ObjectId, ref: 'Cat'},
    street: { type: String, required: true, unique: true },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;