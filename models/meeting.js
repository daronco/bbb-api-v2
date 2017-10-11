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

    // users() {
    //     return Math.floor(Math.random() * 10);
    // }

    static all() {
        return allMeetings;
    }

    static find(meetingId) {
        return [allMeetings.find((e) => {
            return e.meetingId.toString() === meetingId.toString();
        })];
    }

    static add(meeting) {
        allMeetings.push(meeting);
    }
}

var allMeetings = [1, 2, 3, 4].map(i => new Meeting({meetingId: i, name: `Meeting ${i}`}));

module.exports = Meeting;
