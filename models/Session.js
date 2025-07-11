const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  name: String,
  description: String,
  maxScore: Number,
});

module.exports = mongoose.model('Session', SessionSchema);
