const gql = require('graphql-tag');

const typeDefs = gql`
    type User{
        id: ID!
        username: String!
        token: String
        createdAt: String!
        character: Character
    }
    type Character{
        name: String!
        battleCount: Int!
        coins: Int!
    }
    type taskResult{
        newTotleCoins: Int!
        taskRewards: [Int]!
    }
    type Query{
        getUser: User!
    }
    type Mutation{
        register(username: String! ,password: String!): User!
        login(username: String! ,password: String!): User!
        createNewCharacter(characterName: String!): User!
        completeTask(totalTimes: Int): taskResult!
    }
`;

module.exports = typeDefs