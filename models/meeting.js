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
    this.uniqueMeetingId = `${this.meetingId}-${new Date().getTime()}`;
    this.createdAt = new Date().toISOString();
    this.running = false;
    this.startedAt = null;
    this.endedAt = null;
    this.hasBeenForciblyEnded = false;
    this.isBreakout = false;
    console.log("Creating the meeting:", this);
  }

  users() {
    const uniqueMeetingId = this.uniqueMeetingId;
    return require('./user').all().filter(
      u => u.uniqueMeetingId === uniqueMeetingId
    );
  }

  // users() {
  //     return Math.floor(Math.random() * 10);
  // }

  static all() {
    return Object.values(allMeetings);
  }

  static find(uniqueMeetingId) {
    return allMeetings[uniqueMeetingId];
  }

  static add(meeting) {
    allMeetings[meeting.uniqueMeetingId] = meeting;
  }

  static any() {
    var keys = Object.keys(allMeetings);
    var selected = keys[Math.floor(Math.random() * keys.length)];
    return allMeetings[selected];
  }
}

var allMeetings = [1, 2, 3, 4, 5].map(
  i => new Meeting({meetingId: `meeting-${i}`, name: `Meeting ${i}`})
).reduce((acc, item, _) => {
  acc[item.uniqueMeetingId] = item;
  return acc;
}, {});

module.exports = Meeting;
