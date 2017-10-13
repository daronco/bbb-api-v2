const database = require('../lib/database');
const redis = require("redis");
const crypto = require("crypto");

class User {
  constructor(params) {
    this.userId = params.userId || crypto.randomBytes(8).toString('hex');
    this.uniqueUserId = params.uniqueUserId || `${this.userId}-${new Date().getTime()}`;
    this.uniqueMeetingId = params.uniqueMeetingId || "";
    this.fullName = params.fullName || crypto.randomBytes(20).toString('hex');
    this.role = params.role || 'ATTENDEE';
    this.isPresenter = params.isPresenter || false;
    this.isListeningOnly = params.isListeningOnly || false;
    this.hasJoinedVoice = params.hasJoinedVoice || false;
    this.hasVideo = params.hasVideo || false;
    console.log("Creating the user:", this);
  }

  createOnBBB() {
    return new Promise((resolve, reject) => {
      let message = this.getCreateMessage();
      let client = redis.createClient(6379, '10.0.3.244');
      client.publish("to-akka-apps-redis-channel", JSON.stringify(message));
      // TODO: wait for the user to be in the db and update it from there to return
      client.quit();
      resolve(this);

      // TODO: create a session token to return on /enter
    });
  }

  getCreateMessage() {
    return {
      envelope: { name: 'RegisterUserReqMsg', routing: { sender: 'bbb-web' } },
      core: {
        header: {
          name: 'RegisterUserReqMsg',
          meetingId: this.uniqueMeetingId
        },
        body: {
          meetingId: this.uniqueMeetingId,
          intUserId: this.uniqueUserId,
          name: this.fullName,
          role: this.role,      // TODO: attendee
          extUserId: this.userId,
          authToken: crypto.randomBytes(16).toString('hex'),
          avatarURL: 'http://10.0.3.244/client/avatar.png',
          guest: false,
          authed: false
        }
      }
    };
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
