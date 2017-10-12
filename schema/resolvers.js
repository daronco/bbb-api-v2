const Brain = require('../lib/brain');

// The root provides a resolver function for each API endpoint
module.exports = {
    meetings: ({uniqueMeetingId}) => {
        console.log("Received meetings with", uniqueMeetingId);
        return Brain.meetings(uniqueMeetingId);
    },
    createMeeting: ({params}) => {
        console.log("Received createMeeting with", params);
        return Brain.createMeeting(params);
    },
    users: ({uniqueUserId}) => {
        console.log("Received users with", uniqueUserId);
        return Brain.users(uniqueUserId);
    },
};
