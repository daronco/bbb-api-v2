const database = require('../lib/database');
const redis = require("redis");
const crypto = require("crypto");

const Meeting = require("../models/meeting");
const session = require("../lib/session");

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
    this.authToken = crypto.randomBytes(16).toString('hex');
    this.sessionToken = crypto.randomBytes(16).toString('hex');
    console.log("Creating the user:", this);
  }

  createOnBBB() {
    return new Promise((resolve, reject) => {
      let message = this.getCreateMessage();
      let client = redis.createClient(6379, '10.0.3.244');
      client.publish("to-akka-apps-redis-channel", JSON.stringify(message));
      client.quit();

      session.add(this.sessionToken, this.uniqueUserId);

      // TODO: wait for the user to be in the db and update it from there to return
      resolve(this);
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
          authToken: this.authToken,
          avatarURL: 'http://10.0.3.244/client/avatar.png',
          guest: false,
          authed: false
        }
      }
    };
  }

  getEnterMessage() {
    Meeting.find(this.uniqueMeetingId).then((meetings) => {
      let meeting = meetings[0];
      return {
        response: {
          returncode: "SUCCESS",
          fullname: this.fullName,
          confname: meeting.name,
          meetingID: meeting.uniqueMeetingId,
          externMeetingID: meeting.meetingId,
          externUserID: this.userId,
          internalUserID: this.uniqueUserId,
          authToken: this.authToken,
          role: User.roleToDb(this.role),
          guest: false,
          conference: meeting.uniqueMeetingId,
          room: meeting.uniqueMeetingId,
          voicebridge: meeting.voiceBridge.toString(),
          dialnumber: meeting.dialNumber,
          webvoiceconf: meeting.voiceBridge.toString(),
          mode: "LIVE",
          record: meeting.recording,
          isBreakout: meeting.isBreakout,
          logoutTimer: 240,
          allowStartStopRecording: true,
          webcamsOnlyForModerator: false,
          welcome: "<br>Welcome to <b>random-8920494<\u002fb>!<br><br>This BigBlueButton server is freely provided by <a href=\"http://www.blindsidenetworks.com/\" target=\"_blank\"><b>Blindside Networks<\u002fb><\u002fa> under the following <a href=\"http://www.blindsidenetworks.com/free-tier-terms-of-use/\" target=\"_blank\"><u>Terms and Conditions<\u002fu><\u002fa>.  Because this server is used for testing, your sessions and recordings may be accessible by others and will be perodically deleted. We offer <a href=\"http://www.blindsidenetworks.com/hosting\" target=\"_blank\"><u>hosting for BigBlueButton<\u002fu><\u002fa> with permanent recordings (and other features).",
          logoutUrl: "https://test-install.blindsidenetworks.com",
          defaultLayout: "NOLAYOUT",
          avatarURL: "https://test-install.blindsidenetworks.com/client/avatar.png",
          customdata: [],
          metadata: meeting.metadata
        }
      };
    });
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
      let query = { 'body.userId': uniqueUserId };
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
      // userId: userInfo.body.extId, // TODO: ??
      uniqueUserId: userInfo.body.userId,
      uniqueMeetingId: userInfo.header.meetingId,
      fullName: userInfo.body.name,
      role: User.roleFromDb(userInfo.body.role),
      // TODO ??
      // isPresenter: userInfo.body.presenter,
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

  static roleToDb(role) {
    if (role === 'MODERATOR') {
      return role;
    } else {
      return 'VIEWER';
    }
  }
}

module.exports = User;
