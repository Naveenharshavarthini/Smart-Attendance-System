const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Staff', 'Student'], required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Optional, for staff and students
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // For students
  dob: { type: Date },
  idCardId: { type: String }, // For students
  otherDetails: { type: Object }, // Any other custom fields
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },  // Ensure this field exists
  profilePhoto: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
