const mongoose = require('mongoose');
const { Schema } = mongoose;

let area = ['North', 'South', 'East', 'West', 'North-East', 'Central', 'North-West']

const districtSchema = new Schema({
    name: { type: String, required: true, unique: true },
    locality: { type: String, enum: area, required: true },
});

const District = mongoose.model("District", districtSchema);

module.exports = District;