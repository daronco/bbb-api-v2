const Meeting = require('../models/meeting');
const User = require('../models/user');

class Brain {
  constructor() {
  }

  static async meetings(uniqueMeetingId, callback) {
    if (uniqueMeetingId === null || uniqueMeetingId === undefined) {
      return await Meeting.all();
    } else {
      return await Meeting.find(uniqueMeetingId);
    }
  }

  static async users(uniqueUserId) {
    if (uniqueUserId === null || uniqueUserId === undefined) {
      return await User.all();
    } else {
      return await User.find(uniqueUserId);
    }
  }

  static async createMeeting(params) {
    const meeting = new Meeting(params);
    return await meeting.createOnBBB();
  }

  static async createUser(params) {
    const user = new User(params);
    return await user.createOnBBB();
  }
}

module.exports = Brain;
