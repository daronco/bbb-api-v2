var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Meeting {
    meetingId: String!
    name: String!
  }

  type Query {
    meetings: [Meeting]
    meeting(meetingId: String): Meeting
  }

  type Mutation {
    createMeeting(meetingId: String!, name: String!): Meeting
  }
`);

module.exports = schema;
