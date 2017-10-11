class Meeting {
    constructor({meetingId, name}) {
        console.log("Creating the meeting:", {meetingId, name});
        this.meetingId = meetingId;
        this.name = name;
    }

    // users() {
    //     return Math.floor(Math.random() * 10);
    // }

    static all() {
        return allMeetings;
    }

    static add(meeting) {
        allMeetings.push(meeting);
    }
}

var allMeetings = [1, 2, 3, 4].map(i => new Meeting({meetingId: i, name: `Meeting ${i}`}));

module.exports = Meeting;
