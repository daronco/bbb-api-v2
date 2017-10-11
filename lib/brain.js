const Meeting = require('../models/meeting');

class Brain {
    constructor() {
    }

    static createMeeting(params) {
        const m = new Meeting(params);
        Meeting.add(m);
        return m;
    }

    static meetings(meetingId) {
        if (meetingId === null || meetingId === undefined) {
            return Meeting.all();
        } else {
            return Meeting.find(meetingId);
        }
    }
}

module.exports = Brain;
