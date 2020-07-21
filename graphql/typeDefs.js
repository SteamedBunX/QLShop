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
    interface Item{
        id: ID!
        name: String!
        description: String!
    }
    type Gear implements Item{
        id: ID!
        name: String!
        gearTypeId: Int
        description: String!
        attributes: [Attribute]!
    }
    type Consumable implements Item {
        id: ID!
        name: String!
        description: String!
        effect: String!
        cooldown: Int
    }
    type Material implements Item {
        id: ID!
        name: String!
        description: String!
    }
    type Attribute{
        name: String!
        value: String!
    }
    type taskResult{
        newTotalCoins: Int!
        taskRewards: [Int]!
    }
    type Query{
        getUser: User!
        getItems(itemIds: [String!], typeId: [Int!], gearTypeId: [Int!]): [Item]!
    }
    type Mutation{
        register(username: String! ,password: String!): User!
        login(username: String! ,password: String!): User!
        createNewCharacter(characterName: String!): User!
        completeTask(totalTimes: Int): taskResult!
    }
`;

module.exports = typeDefs