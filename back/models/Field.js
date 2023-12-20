// models/Field.js
const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;
