const checkAuth = require('../../util/check-auth');
const getCharacter = require(`../../util/get-character`);
const User = require('../../models/User');
const Character = require('../../models/Character');
const Shop = require('../../models/Shop');
const { UserInputError, AuthenticationError } = require('apollo-server');
const StaticTables = require('../../util/static-tables');

var Query = {};
var Mutation = {};

Query.getShops = async (_, { shopIds }) => {
    var shops = [];
    if (!Array.isArray(shopIds) || !shopIds.length) {
        shops = await Shop.find();
        return shops;
    }
    shops = await Shop.find().where('_id').in(shopIds).exec();
    if (!Array.isArray(shops) || !shops.length) {
        throw new UserInputError(`Could not find any shop with requested IDs`);
    }
    return shops;
}

Mutation.buyItems = async (_, { shopId, purchaseRequests }, context) => {
    const tokenData = checkAuth(context);
    const user = await User.findById(tokenData.id);
    if (!user) {
        throw new AuthenticationError('Unable to find the user for the token');
    }

    var character = await getCharacter(user.character);
    const shop = StaticTables.shops.find(shop => shop._id === shopId);

    if (!character) {
        throw new UserInputError(`Could not find a character for the user`);
    }
    if (!shop) {
        throw new UserInputError(`Could not find a shop with requested ID`);
    }

    // Check if User has enough clearCount to access the shop
    if (character.battleCount < shop.minimiumBattleCount) {
        throw new AuthenticationError(`This character does not have enough battle count to purchase from this shop`);
    }

    var totalPurchaseCost = 0;
    shopInventory = shop.inventory;

    purchaseRequests.forEach(purchaseRequest => {
        // Check if Item exist and is exists in the shop inentory
        var shopInventoryItemIndex = shopInventory.findIndex(item => item.itemId === purchaseRequest.itemId);
        if (shopInventoryItemIndex < 0) {
            throw new Error('Item not sold in this shop');
        }

        // Calculate price
        totalPurchaseCost += shopInventory[shopInventoryItemIndex].purchasePrice * purchaseRequest.amount;

        // Check if there is already that item in the inventory

        var inventoryItemIndex = character.inventory.findIndex(inventoryItem => inventoryItem.itemId === purchaseRequest.itemId);

        // Add Item to inventory
        if (inventoryItemIndex < 0) {
            character.inventory.push({ itemId: purchaseRequest.itemId, amount: purchaseRequest.amount });
        } else {
            character.inventory[inventoryItemIndex].amount += purchaseRequest.amount;
        }
    })

    if (character.coins < totalPurchaseCost) {
        throw new Error('Does not have enough coin for this purchase');
    }

    character.coins -= totalPurchaseCost;

    // Save changes
    character.save();

    return {
        transactionAmount: -totalPurchaseCost,
        updatedInventory: character.inventory,
        updatedCoinAmount: character.coins
    }
}

module.exports.Query = Query;
module.exports.Mutation = Mutation;

