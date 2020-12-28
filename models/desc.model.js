let mongoose = require('mongoose');
let { Schema } = mongoose;

const descSchema = new Schema({
    catDescription: { type: String, required: true },
    byUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    forCat: { type: Schema.Types.ObjectId, required: true, ref: 'Cat' },
}, {timestamps: true})

const Desc = mongoose.model('Desc', descSchema);
module.exports = Desc;