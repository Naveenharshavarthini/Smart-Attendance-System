const mongoose = require('mongoose');
const ClassSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  year: { type: Number, required: true },
  section: { type: String, required: true },
  className: { type: String, required: true },
  classTeacher: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number}
});
module.exports = mongoose.model('Class', ClassSchema);
