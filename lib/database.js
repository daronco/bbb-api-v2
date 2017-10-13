var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

module.exports = {
  db: null,
  url: 'mongodb://10.0.3.244:27017/bigbluebutton',

  connect: (callback) => {
    if (module.exports.db !== null && module.exports.db !== undefined) {
      callback(null, module.exports.db);
    } else {
      MongoClient.connect(module.exports.url, (err, db) => {
        assert.equal(null, err);
        console.log("Connected to mongodb");
        module.exports.db = db;
        callback(err, module.exports.db);
      });
    }
  },

  close: () => {
    module.exports.db.close();
  },
};
