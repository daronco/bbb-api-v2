const database = require('../lib/database');

class User {
  constructor(params) {
    this.userId = params.userId;
    this.uniqueUserId = params.uniqueUserId || `${this.userId}-${new Date().getTime()}`;
    this.uniqueMeetingId = params.uniqueMeetingId;
    this.fullName = params.fullName;
    this.role = params.role;
    this.isPresenter = params.isPresenter || false;
    this.isListeningOnly = params.isListeningOnly || false;
    this.hasJoinedVoice = params.hasJoinedVoice || false;
    this.hasVideo = params.hasVideo || false;
    console.log("Creating the user:", this);
  }

  static all() {
    return new Promise((resolve, reject) => {
      var collection = database.db.collection('users');
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          reject(err); return;
        }
        resolve(User.mapFromDb(docs));
      });
    });
  }

  static find(uniqueUserId) {
    return new Promise((resolve, reject) => {
      let collection = database.db.collection('users');
      let query = { 'body.intId': uniqueUserId };
      collection.find(query).toArray(function(err, docs) {
        if (err) {
          reject(err); return;
        }
        resolve(User.mapFromDb(docs));
      });
    });
  }

  static inMeeting(uniqueMeetingId) {
    return new Promise((resolve, reject) => {
      let collection = database.db.collection('users');
      let query = { 'header.meetingId': uniqueMeetingId };
      collection.find(query).toArray(function(err, docs) {
        if (err) {
          reject(err); return;
        }
        resolve(User.mapFromDb(docs));
      });
    });
  }

  // Map one or more users from the database to our internal models
  static mapFromDb(userInfo) {
    if (!Array.isArray(userInfo)) {
      userInfo = [userInfo];
    }
    return userInfo.map(m => User.createFromDb(m));
  }

  // Create a User object with information from a user
  // record from the database
  static createFromDb(userInfo) {
    return new User({
      userId: userInfo.body.extId,
      uniqueUserId: userInfo.body.intId,
      uniqueMeetingId: userInfo.header.meetingId,
      fullName: userInfo.body.name,
      role: User.roleFromDb(userInfo.body.role),
      isPresenter: userInfo.body.presenter,
      // TODO ??
      // isListeningOnly: false;
      // hasJoinedVoice: false;
      // hasVideo: false;
    });
  }

  static roleFromDb(role) {
    if (role.match(/moderator/i)) {
      return 'MODERATOR';
    } else {
      return 'ATTENDEE';
    }
  }
}

module.exports = User;
