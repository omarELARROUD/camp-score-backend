const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  scores: [
    {
      session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      points: Number
    }
  ]
});

module.exports = mongoose.model('Student', StudentSchema);
