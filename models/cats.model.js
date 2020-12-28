let mongoose = require('mongoose');
let { Schema } = mongoose;

let gender = ['Male', 'Female', 'Not Sure'];
let ster = ['Yes', 'No', 'Not Sure'];

const catSchema = new Schema({
    names: [{ type: String, required: true }],
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    breed: String,
    gender: { type: String, enum: gender, default: gender[2], },
    sterilised: { type: String, enum: ster, default: "Not Sure" },
    colours: [{ type: String }],
    desc: [{ type: Schema.Types.ObjectId, ref: 'Desc' }],
    fed: [{ type: Schema.Types.ObjectId, ref: 'Fed' }],
    photos: [{
        image: String,
        isDefault: { type: Boolean, default: false },
        desc: { type: String, required: true },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    missing: { type: Boolean, default: false },
    duplicate: { type: Boolean, default: false },
})

const Cat = mongoose.model('Cat', catSchema);
module.exports = Cat;