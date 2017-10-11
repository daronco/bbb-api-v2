const Brain = require('../lib/brain');

// The root provides a resolver function for each API endpoint
module.exports = {
    meetings: ({meetingId}) => {
        console.log("Received meetings with", meetingId);
        return Brain.meetings(meetingId);
    },
    createMeeting: ({params}) => {
        console.log("Received createMeeting with", params);
        return Brain.createMeeting(params);
    },
};
