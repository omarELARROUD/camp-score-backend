const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  name: String,
  description: String
});

module.exports = mongoose.model('Session', SessionSchema);
