const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    department: { type: String, required: true },
    clockInTime: { type: Date, required: true, default: Date.now },
    studentLatitude: { type: Number, required: true },
    studentLongitude: { type: Number, required: true },
    idCard: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    createOndate:{type:Date,required:true,default:Date.now},
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },

});

module.exports = mongoose.model('Attendance', attendanceSchema);
