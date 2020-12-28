let mongoose = require('mongoose');
let { Schema } = mongoose;

const feedingSchema = new Schema({
    foodDescription: {type: String, required: true},
    byUser: { type: Schema.Types.ObjectId, required: true },
    forCat: { type: Schema.Types.ObjectId, required: true },
}, {timestamps: true})

const Fed = mongoose.model('Fed', feedingSchema);
module.exports = Fed;