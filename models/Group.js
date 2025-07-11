const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  color: String,
  sessionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }]
});

module.exports = mongoose.model('Group', groupSchema);
