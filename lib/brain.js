const Meeting = require('../models/meeting');
const User = require('../models/user');

class Brain {
  constructor() {
  }

  // static createMeeting(params) {
  //   const m = new Meeting(params);
  //   Meeting.add(m);
  //   return m;
  // }

  static async meetings(uniqueMeetingId, callback) {
    if (uniqueMeetingId === null || uniqueMeetingId === undefined) {
      return await Meeting.all();
    } else {
      return await Meeting.find(uniqueMeetingId);
    }
  }

  static users(uniqueUserId) {
    if (uniqueUserId === null || uniqueUserId === undefined) {
      return User.all();
    } else {
      return [User.find(uniqueUserId)];
    }
  }
}

module.exports = Brain;
