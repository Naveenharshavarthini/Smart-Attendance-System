// const mongoose = require('mongoose');

// const AttendanceSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   date: { type: String, required: true },  // Use a simple string to represent the date (e.g., '2023-09-19')
//   slots: [
//     {
//       slot: { type: Number, required: true },  // Slot number (1 to 8, representing hours)
//       status: { type: String, enum: ['Present', 'Absent'], required: true },
//       clockInTime: { type: Date, required: true }
//     }
//   ],
//   class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
// });

// module.exports = mongoose.model('Attendance', AttendanceSchema);
