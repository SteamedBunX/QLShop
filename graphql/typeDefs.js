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
    type Item{
        id: ID!
        name: String!
        typeId: Int!
        description: String!
        attributes: [Attribute]!
    }
    type Attribute{
        name: String,
        value: String
    }
    type taskResult{
        newTotleCoins: Int!
        taskRewards: [Int]!
    }
    type Query{
        getUser: User!
        getItem(itemId: String!): Item!
    }
    type Mutation{
        register(username: String! ,password: String!): User!
        login(username: String! ,password: String!): User!
        createNewCharacter(characterName: String!): User!
        completeTask(totalTimes: Int): taskResult!
    }
`;

module.exports = typeDefs