var mongoose = require('mongoose');

var graffitiSchema = mongoose.Schema({
  body: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Graffiti', graffitiSchema);
