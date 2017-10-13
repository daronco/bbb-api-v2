const database = require('../lib/database');

class Meeting {
  constructor(params) {
    this.meetingId = params.meetingId;
    this.name = params.name;
    this.voiceBridge = params.voiceBridge;
    this.dialNumber = params.dialNumber;
    this.attendeePassword = params.attendeePassword;
    this.moderatorPassword = params.moderatorPassword;
    this.duration = params.duration;
    this.recording = params.recording;
    this.maxUsers = params.maxUsers;
    this.metadata = params.metadata;
    this.isBreakout = params.isBreakout;
    this.uniqueMeetingId = params.uniqueMeetingId || `${this.meetingId}-${new Date().getTime()}`;
    this.createdAt = params.createdAt || new Date().toISOString();
    this.running = params.running || false;
    this.startedAt = params.startedAt || null;
    this.endedAt = params.endedAt || null;
    this.hasBeenForciblyEnded = params.hasBeenForciblyEnded || false;
    console.log("Creating the meeting:", this);
  }

  users() {
    return require('./user').inMeeting(this.uniqueMeetingId);
  }

  static all() {
    return new Promise((resolve, reject) => {
      var collection = database.db.collection('meetings');
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          reject(err); return;
        }
        resolve(Meeting.mapFromDb(docs));
      });
    });
  }

  static find(uniqueMeetingId) {
    return new Promise((resolve, reject) => {
      var collection = database.db.collection('meetings');
      var query = { 'meetingProp.intId': uniqueMeetingId };
      collection.find(query).toArray(function(err, docs) {
        if (err) {
          reject(err); return;
        }
        resolve(Meeting.mapFromDb(docs));
      });
    });
  }

  // Map one or more meetings from the database to our internal models
  static mapFromDb(meetingInfo) {
    if (!Array.isArray(meetingInfo)) {
      meetingInfo = [meetingInfo];
    }
    return meetingInfo.map(m => Meeting.createFromDb(m));
  }

  // Create a Meeting object with information from a meeting
  // record from the database
  static createFromDb(meetingInfo) {
    return new Meeting({
      meetingId: meetingInfo.meetingProp.extId,
      name: meetingInfo.meetingProp.name,
      voiceBridge: meetingInfo.voiceProp.voiceConf,
      dialNumber: meetingInfo.dialNumber,
      attendeePassword: meetingInfo.password.viewerPass,
      moderatorPassword: meetingInfo.password.moderatorPass,
      duration: meetingInfo.durationProps.duration,
      recording: meetingInfo.recordProp.record,
      maxUsers: meetingInfo.usersProp.maxUsers,
      metadata: meetingInfo.metadataProp.metadata,
      uniqueMeetingId: meetingInfo.meetingProp.intId,
      createdAt: new Date(meetingInfo.durationProps.createdTime).toISOString(),
      isBreakout: (meetingInfo.breakoutProps.parentId != 'bbb-none')
      // running:  false; TODO ??
      // startedAt: null; TODO ??
      // endedAt = null; TODO ??
      // hasBeenForciblyEnded = false;  TODO ??
    });
  }

  // static add(meeting) {
  //   allMeetings[meeting.uniqueMeetingId] = meeting;
  // }

  // static any() {
  //   var keys = Object.keys(allMeetings);
  //   var selected = keys[Math.floor(Math.random() * keys.length)];
  //   return allMeetings[selected];
  // }
}

module.exports = Meeting;
