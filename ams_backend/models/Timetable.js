const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
 // department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  schedule: [
    {
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'], required: true },
      slots: [
        {
          hour: { type: String, required: true },  // ex: "9-10", "10-11"
          subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Timetable', TimetableSchema);
