const mongoose = require('mongoose');
const TableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  schedule: [{
    day: { type: String, required: true },
    subjects: [{
      hour: { type: Number, required: true },
      subject: { type: String, required: true }
    }]
  }]
});
module.exports = mongoose.model('Table', TableSchema);
