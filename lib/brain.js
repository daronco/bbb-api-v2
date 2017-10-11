const Meeting = require('../models/meeting');

class Brain {
    constructor() {
    }

    static createMeeting({meetingId, name}) {
        const m = new Meeting({meetingId, name});
        Meeting.add(m);
        return m;
    }

    static meetings() {
        return Meeting.all();
    }
}

module.exports = Brain;
