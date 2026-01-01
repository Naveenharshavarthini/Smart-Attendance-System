const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  latitude: { type: Number, required: true },      // New field
  longitude: { type: Number, required: true }      // New field
});

module.exports = mongoose.model('Subject', SubjectSchema);
