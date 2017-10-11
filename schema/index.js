var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Meeting {
    meetingId: String!
    uniqueMeetingId: String
    name: String!
    createdAt: String
    voiceBridge: Int
    dialNumber: String
    attendePassword: String
    moderatorPassword: String
    running: Boolean
    duration: Int
    recording: Boolean
    startedAt: String
    endedAt: String
    hasBeenForciblyEnded: Boolean
    maxUsers: Int
    isBreakout: Boolean
    metadata: [Metadata]
  }

  type Metadata {
    name: String!
    value: String!
  }

  input MeetingInput {
    meetingId: String!
    name: String!
    voiceBridge: Int
    dialNumber: String
    attendePassword: String
    moderatorPassword: String
    duration: Int
    recording: Boolean
    maxUsers: Int
    metadata: [MetadataInput]
  }

  input MetadataInput {
    name: String!
    value: String!
  }

  type Query {
    meetings(meetingId: String): [Meeting]
  }

  type Mutation {
    createMeeting(params: MeetingInput): Meeting
  }
`);

// to put on User
// <participantCount>0</participantCount>
// <listenerCount>0</listenerCount>
// <voiceParticipantCount>0</voiceParticipantCount>
// <videoCount>0</videoCount>
// <moderatorCount>0</moderatorCount>


module.exports = schema;
