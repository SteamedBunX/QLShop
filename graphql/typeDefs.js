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
        inventory: [InventoryItem]!
    }
    type InventoryItem{
        itemId: ID!
        amount: Int!
    }
    type TaskRewardItem{
        itemId: ID!
        amount: Int!
    }
    interface Item{
        id: ID!
        name: String!
        description: String!
        sellPrice: Int
    }
    type Gear implements Item{
        id: ID!
        name: String!
        gearTypeId: Int
        description: String!
        attributes: [Attribute]!
        sellPrice: Int
    }
    type Consumable implements Item {
        id: ID!
        name: String!
        description: String!
        effect: String!
        cooldown: Int
        sellPrice: Int
    }
    type Material implements Item {
        id: ID!
        name: String!
        description: String!
        sellPrice: Int
    }
    type Attribute{
        name: String!
        value: String!
    }
    type taskResult{
        newTotalCoins: Int!
        coinRewards: [Int]!
        itemRewards: [TaskRewardItem]!
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