const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    _: String
  }

  type Mutation {
    singUp(name: String!, email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String!
  }
`;

module.exports = typeDefs;
