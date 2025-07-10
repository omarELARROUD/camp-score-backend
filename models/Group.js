const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: String,
  description: String
});

module.exports = mongoose.model('Group', GroupSchema);
