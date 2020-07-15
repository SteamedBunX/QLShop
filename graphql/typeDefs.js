const gql = require('graphql-tag');

const typeDefs = gql`

    type User{
        id: ID!
        username: String!
        token: String!
        createdAt: String!
        character: Character
    }
    type Character{
        name: String!
        battleCount: Int!
        coins: Int!
    }
    type Query{
        helloWorld: String!
    }
    type Mutation{
        register(username: String! ,password: String!): User!
        login(username: String! ,password: String!): User!
    }
`;

module.exports = typeDefs