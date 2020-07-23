const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../../config');
const User = require('../../models/User');
const Character = require('../../models/Character');
const Item = require('../../models/Item');
const { UserInputError, AuthenticationError } = require('apollo-server');
const checkAuth = require('../../util/check-auth');

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
    var lootTable = [];
    await Item.find({ typeId: 2 }, { _id: 1 }, (err, res) => {
        lootTable = res.map(a => a._id);
    });
    const itemRewards = generateItemRewards(lootTable, totalTimes);
    var remappedItemRewards = [];

    for (let itemId in itemRewards) {
        remappedItemRewards.push({
            itemId,
            amount: itemRewards[itemId]
        });
        const indexOfItem = character.inventory.findIndex((inventoryItem => inventoryItem.item == itemId));
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
    const characterId = user.character;
    var character;
    if (characterId) {
        await Character.findById(characterId, (err, res) => {
            if (!err) {
                character = res;
            } else {
                character = null;
            }
        });
    }

    return character;
}

module.exports.Mutation = Mutation;
module.exports.Query = Query;
