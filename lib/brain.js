const Meeting = require('../models/meeting');

class Brain {
    constructor() {
    }

    static createMeeting(params) {
        const m = new Meeting(params);
        Meeting.add(m);
        return m;
    }

    static meetings(uniqueMeetingId) {
        if (uniqueMeetingId === null || uniqueMeetingId === undefined) {
            return Meeting.all();
        } else {
            return [Meeting.find(uniqueMeetingId)];
        }
    }
}

module.exports = Brain;
