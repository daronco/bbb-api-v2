//import GraphQLJSON from 'graphql-type-json';
const Brain = require('../lib/brain');
const { GraphQLScalarType } = require('graphql');
const GraphQLJSON = require('graphql-type-json');
// var GraphQLScalarType = require('graphql/scalar'); // CommonJS

// The root provides a resolver function for each API endpoint
module.exports = {
  JSON: GraphQLJSON,

  Query: {
    meetings: (_, {uniqueMeetingId}) => {
      console.log("Received meetings with", uniqueMeetingId);
      return Brain.meetings(uniqueMeetingId);
    },

    users: (_, {uniqueUserId}) => {
      console.log("Received users with", uniqueUserId);
      return Brain.users(uniqueUserId);
    },
  },

  Mutation: {
    createMeeting: (_, {params}) => {
      console.log("Received createMeeting with", params);
      return Brain.createMeeting(params);
    },

    createUser: (_, {params}) => {
      console.log("Received createUser with", params);
      return Brain.createUser(params);
    },
  }
};
