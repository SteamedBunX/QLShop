const User = require('../../models/User');
const Character = require('../../models/Character');
const Item = require('../../models/Item');
const { AuthenticationError } = require('apollo-server');
const checkAuth = require('../../util/check-auth');
const getCharacter = require(`../../util/get-character`);
const StaticTables = require('../../util/static-tables');

var Mutation = {};
var Query = {};

Mutation.completeTask = async (_, { totalTimes }, context) => {

    const tokenData = checkAuth(context);
    const user = await User.findById(tokenData.id);
    const character = await Character.findById(user.character);
    if (!totalTimes) {
        totalTimes = 1;
    }

    // create drop list for Coins and update character's total coin count
    const { totalCoinReward, coinRewards } = generateCoinRewards(totalTimes);
    character.coins = character.coins + totalCoinReward;

    // create a list of loots, and update character's inventory
    const lootTable = await StaticTables.initialized.lootTable;
    const itemRewards = generateItemRewards(lootTable, totalTimes);
    var remappedItemRewards = [];

    for (let itemId in itemRewards) {
        remappedItemRewards.push({
            itemId,
            amount: itemRewards[itemId]
        });
        const indexOfItem = character.inventory.findIndex((inventoryItem => inventoryItem.itemId == itemId));
        if (indexOfItem < 0) {
            character.inventory.push({
                itemId: itemId,
                amount: itemRewards[itemId]
            })
        } else {
            character.inventory[indexOfItem].amount += itemRewards[itemId];
        }
    }

    character.battleCount += totalTimes;
    character.save();

    return {
        newTotalCoins: character.coins,
        coinRewards: coinRewards,
        itemRewards: remappedItemRewards,
    }
}

function generateCoinRewards(totalTimes) {

    var totalCoinReward = 0;
    var coinRewards = [];
    for (i = 0; i < totalTimes; i++) {
        var coinReward = Math.floor(Math.random() * 500);
        coinRewards.push(coinReward);
        totalCoinReward += coinReward;
    }
    return {
        totalCoinReward,
        coinRewards
    }
}

function generateItemRewards(lootTable, totalTimes) {

    const lootTableSize = lootTable.length;
    const itemRewards = {};
    for (i = 0; i < totalTimes; i++) {
        var totalItemAmount = Math.floor(Math.random() * 5);
        for (j = 0; j < totalItemAmount; j++) {
            const dropItemId = lootTable[Math.floor(Math.random() * lootTableSize)];
            if (typeof itemRewards[dropItemId] === "undefined") {
                itemRewards[dropItemId] = 1;
            } else {
                itemRewards[dropItemId]++;
            }
        }
    }
    return itemRewards
}

Query.getCharacter = async (_, { }, context) => {
    const tokenData = checkAuth(context);
    const user = await User.findById(tokenData.id);
    if (!user) {
        throw new AuthenticationError('Unable to find the user for the token');
    }
    const character = await getCharacter(user.character);
    return character;
}

Mutation.sellItems = async (_, { sellRequests }, context) => {
    const tokenData = checkAuth(context);
    const user = await User.findById(tokenData.id);
    if (!user) {
        throw new AuthenticationError('Unable to find the user for the token');
    }

    var character = await getCharacter(user.character);

    // Check for validality of Item
    const itemTable = await StaticTables.initialized.itemTable;

    var totalSellPrice = 0;

    sellRequests.forEach(sellRequest => {
        // Check if Item exist and is sellable
        var codexItemIndex = itemTable.findIndex(item => item._id === sellRequest.itemId);
        if (codexItemIndex < 0) {
            throw new Error('Invalid ItemID');
        } else if (!itemTable[codexItemIndex].sellPrice || itemTable[codexItemIndex].sellPrice <= 0) {
            throw new Error('unsellable Item');
        }

        // Check if there is enough in the inventory

        var inventoryItemIndex = character.inventory.findIndex(inventoryItem => inventoryItem.itemId === sellRequest.itemId &&
            inventoryItem.amount >= sellRequest.amount);
        if (inventoryItemIndex < 0) {
            throw new Error('Not enough item in the inventory.');
        }

        // Deduct Item 
        character.inventory[inventoryItemIndex].amount -= sellRequest.amount;
        if(character.inventory[inventoryItemIndex].amount <= 0) {
            character.inventory.splice(inventoryItemIndex,1);
        }

        // Add Coin
        totalSellPrice += sellRequest.amount * itemTable[codexItemIndex].sellPrice;
    });

    // Add coin reward to character account
    character.coins += totalSellPrice

    // Save changes
    character.save();

    return {
        totalSellPrice,
        updatedInventory: character.inventory,
        updatedCoinAmount: character.coins
    }
}

module.exports.Mutation = Mutation;
module.exports.Query = Query;
