const Brain = require('../lib/brain');

// The root provides a resolver function for each API endpoint
module.exports = {
    meetings: () => {
        console.log("Received meetings");
        return Brain.meetings();
    },
    createMeeting: ({meetingId, name}) => {
        console.log("Received createMeeting");
        return Brain.createMeeting({meetingId, name});
    },
};
