const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cnode', {useMongoClient: true});

mongoose.connection.on('connected', () => {
  console.log('mongoose connected');
});

mongoose.connection.on('error', (err) => {
  console.error(`mongoose connect ERROR: ${err.stack}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoose disconnected');
});

const Schema = mongoose.Schema;
const InfoSchema = new Schema({
  title: {type: String},
  href: {type: String},
  author: {type: String},
  avatar: {type: String},
  content: {type: String}
});

module.exports = mongoose.model('Info', InfoSchema);