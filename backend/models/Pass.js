const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { collection: 'username' });

module.exports = mongoose.model('Pass', passSchema);
