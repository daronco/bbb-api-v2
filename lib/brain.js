const Meeting = require('../models/meeting');
const User = require('../models/user');

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

    static users(uniqueUserId) {
        if (uniqueUserId === null || uniqueUserId === undefined) {
            return User.all();
        } else {
            return [User.find(uniqueUserId)];
        }
    }
}

module.exports = Brain;
