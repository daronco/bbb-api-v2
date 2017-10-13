const database = require('../lib/database');
const redis = require("redis");
const crypto = require("crypto");

class Meeting {
  constructor(params) {
    this.meetingId = params.meetingId || "";
    this.name = params.name || "";
    this.voiceBridge = params.voiceBridge || "";
    this.dialNumber = params.dialNumber || 0;
    this.attendeePassword = params.attendeePassword || "ap";
    this.moderatorPassword = params.moderatorPassword || "mp";
    this.duration = params.duration || 0;
    this.recording = params.recording || false;
    this.maxUsers = params.maxUsers || 0;
    this.metadata = params.metadata || {};
    this.isBreakout = params.isBreakout || false;
    this.createdAt = params.createdAt || new Date().toISOString();
    this.running = params.running || false;
    this.startedAt = params.startedAt || null;
    this.endedAt = params.endedAt || null;
    this.hasBeenForciblyEnded = params.hasBeenForciblyEnded || false;

    let defaultId = crypto.createHash('sha1').update(this.meetingId).digest('hex');
    this.uniqueMeetingId = params.uniqueMeetingId || `${defaultId}-${new Date().getTime()}`;

    console.log("Creating the meeting:", this);
  }

  users() {
    return require('./user').inMeeting(this.uniqueMeetingId);
  }

  createOnBBB() {
    return new Promise((resolve, reject) => {
      let message = this.getCreateMessage();
      let client = redis.createClient(6379, '10.0.3.244');
      client.publish("to-akka-apps-redis-channel", JSON.stringify(message));
      // TODO: wait for the meeting to be in the db and update it from there to return
      client.quit();
      resolve(this);
    });
  }

  getCreateMessage() {
    return {
      envelope: { name: 'CreateMeetingReqMsg', routing: { sender: 'bbb-web' } },
      core: {
        header: {
          name: 'CreateMeetingReqMsg'
        },
        body: {
          props: {
            meetingProp: {
              name: this.name,
              extId: this.meetingId,
              intId: this.uniqueMeetingId,
              isBreakout: this.isBreakout
            },
            breakoutProps: { parentId: 'bbb-none', sequence: 0, breakoutRooms: [] },
            durationProps: {
              duration: 0,
              createdTime: new Date().getTime(),
              createdDate: new Date().toString(),
              maxInactivityTimeoutMinutes: 120,
              warnMinutesBeforeMax: 5,
              meetingExpireIfNoUserJoinedInMinutes: 5,
              meetingExpireWhenLastUserLeftInMinutes: 1
            },
            password: {
              moderatorPass: this.moderatorPassword,
              viewerPass: this.attendeePassword
            },
            recordProp: {
              record: this.recording,
              autoStartRecording: false,
              allowStartStopRecording: true
            },
            welcomeProp: {
              welcomeMsgTemplate: '<br>Welcome to <b>%%CONFNAME%%</b>!<br><br>This server is running <a href="http://docs.bigbluebutton.org/" target="_blank"><u>BigBlueButton</u></a>.',
              welcomeMsg: '<br>Welcome to <b>random-805526</b>!<br><br>This server is running <a href="http://docs.bigbluebutton.org/" target="_blank"><u>BigBlueButton</u></a>.',
              modOnlyMessage: ''
            },
            voiceProp: {
              telVoice: this.voiceBridge.toString(),
              voiceConf: this.voiceBridge.toString(),
              dialNumber: this.dialNumber
            },
            usersProp: {
              maxUsers: this.maxUsers,
              webcamsOnlyForModerator: false,
              guestPolicy: 'ASK_MODERATOR'
            },
            metadataProp: { metadata: this.metadata },
            screenshareProps: {
              screenshareConf: '70097-SCREENSHARE',
              red5ScreenshareIp: '10.0.3.244',
              red5ScreenshareApp: 'video-broadcast'
            }
          }
        }
      }
    };
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
