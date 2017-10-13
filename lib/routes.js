const session = require('./session');
const User = require('../models/user');

module.exports = {

  enter: (req, res) => {
    let userId = session.get(req.query.sessionToken);
    console.log("Searching for token", req.query.sessionToken, "returned", userId);
    if (userId !== null && userId !== undefined) {
      User.find(userId).then((found) => {
        res.json(found[0].getEnterMessage());
      });
    } else {
      res.json({});
    }
  }

};
