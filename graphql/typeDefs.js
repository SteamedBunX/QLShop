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
    input TransactionRequest{
        itemId: ID!
        amount: Int!
    }
    type TransactionResult{
        transactionAmount: Int!
        updatedInventory: [InventoryItem]!
        updatedCoinAmount: Int!
    }
    type Attribute{
        name: String!
        value: String!
    }
    type TaskResult{
        newTotalCoins: Int!
        coinRewards: [Int]!
        itemRewards: [TaskRewardItem]!
    }
    type ShopItem{
        purchasePrice: Int,
        itemId: String
    }
    type Shop{
        id: Int!
        name: String!
        minimiumBattleCount: Int!
        shopKeeper: String!
        inventory: [ShopItem]!
    }
    type Query{
        getUser: User!
        getCharacter: Character
        getItems(itemIds: [String!], typeIds: [Int!], gearTypeIds: [Int!]): [Item]!
        getShops(shopIds: [Int!]): [Shop]!
    }
    type Mutation{
        register(username: String! ,password: String!): User!
        login(username: String! ,password: String!): User!
        createNewCharacter(characterName: String!): User!
        completeTask(totalTimes: Int): TaskResult!
        buyItems(shopId: Int!, purchaseRequests: [TransactionRequest]!): TransactionResult!
        sellItems(sellRequests: [TransactionRequest]!): TransactionResult!
    }
`;

module.exports = typeDefs
