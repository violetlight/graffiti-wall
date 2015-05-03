var mongoose = require('mongoose');
var dbURL = 'mongodb://localhost/wall';
mongoose.connect(dbURL);
var db = mongoose.connection;


db.on('error', function(err) {
  console.log('Connection error', err);
});

db.once('open', function() {
  console.log('Successfully connected to database');
});

module.exports = {
};
