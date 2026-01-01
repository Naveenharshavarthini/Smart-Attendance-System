const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  idcardId: { type: String, required: true },
  year: { type: Number, required: true },
  otherDetails: { type: String }
});
module.exports = mongoose.model('Student', StudentSchema);