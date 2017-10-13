const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  enum ROLE {
    ATTENDEE
    MODERATOR
  }

  scalar JSON

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
    metadata: JSON
    users: [User]
  }

  type User {
    userId: String!
    uniqueUserId: String
    fullName: String!
    role: ROLE
    isPresenter: Boolean
    isListeningOnly: Boolean
    hasJoinedVoice: Boolean
    hasVideo: Boolean
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
    meetings(uniqueMeetingId: String): [Meeting]
    users(uniqueUserId: String): [User]
  }

  type Mutation {
    createMeeting(params: MeetingInput): Meeting
  }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});
