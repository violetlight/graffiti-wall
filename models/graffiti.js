var mongoose = require('mongoose');

var graffitiSchema = mongoose.Schema({

  body: String,

  createdAt: { type: Date, default: Date.now },

  x: { type: Number, default: function () {
    return Math.random() * 100;
  }},
  y: { type: Number, default: function () {
    return Math.random() * 100;
  }},

  color: { type: String, default: function() {  // somewhat random hex color
    return (Math.floor(Math.random() * (0xFFFFFF - 0x010000)+0x010000)).toString(16);
  }}

});

module.exports = mongoose.model('Graffiti', graffitiSchema);
