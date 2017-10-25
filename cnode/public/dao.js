const Info = require('./mongo.js');

exports.save = (data) => {
  const info = new Info(data);
  return info.save();
}

exports.insertMany = (data) => {
  return Info.insertMany(data);
}

exports.findHref = () => {
  return Info.find({}, 'href');
}

exports.updateContent = (id, content) => {
  return Info.update({_id: id}, {content: content});
}