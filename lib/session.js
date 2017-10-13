// TODO: figure out when to remove items from the session

module.exports = {
  db: {},

  add: (key, value) => {
    module.exports.db[key] = value;
    console.log("-- session is now", module.exports.db);
  },

  get: (key) => {
    return module.exports.db[key];
  },
};
