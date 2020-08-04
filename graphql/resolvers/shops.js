const checkAuth = require('../../util/check-auth');
const getCharacter = require(`../../util/get-character`);
const User = require('../../models/User');
const Character = require('../../models/Character');
const Shop = require('../../models/Shop');
const { UserInputError, AuthenticationError } = require('apollo-server');

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

// Mutation.buyItems = async (_, { shopId, purchaseRequests }, context) => {
//     const tokenData = checkAuth(context);
//     const user = await User.findById(tokenData.id);
//     if (!user) {
//         throw new AuthenticationError('Unable to find the user for the token');
//     }

//     var character = await getCharacter(user.character);
//     const shop = !Shop.findById(shopId)

//     if (!character) {
//         throw new UserInputError(`Could not find a character for the user`);
//     }
//     if (!shop) {
//         throw new UserInputError(`Could not find a shop with requested ID`);
//     }

//     // Check if User has enough clearCount to access the shop
//     if (character.battleCount < shop.minimiumBattleCount) {
//         throw new AuthenticationError(`This character does not have enough battle count to purchase from this shop`);
//     }

//     // Check for validality of Item
//     var itemTable = await Item.find({}, { _id: 1, sellPrice: 1 });
//     itemTable = itemTable.map(item => { return { _id: item._id.toString(), sellPrice: item.sellPrice } });

//     var totalSellPrice = 0;

//     sellRequests.forEach(sellRequest => {
//         // Check if Item exist and is sellable
//         var codexItemIndex = itemTable.findIndex(item => item._id === sellRequest.itemId);
//         if (codexItemIndex < 0) {
//             throw new Error('Invalid ItemID');
//         } else if (!itemTable[codexItemIndex].sellPrice || itemTable[codexItemIndex].sellPrice <= 0) {
//             throw new Error('unsellable Item');
//         }

//         // Check if there is enough in the inventory

//         var inventoryItemIndex = character.inventory.findIndex(inventoryItem => inventoryItem.itemId === sellRequest.itemId &&
//             inventoryItem.amount >= sellRequest.amount);
//         if (inventoryItemIndex < 0) {
//             throw new Error('Not enough item in the inventory.');
//         }

//         // Deduct Item 
//         character.inventory[inventoryItemIndex].amount -= sellRequest.amount;
//         if (character.inventory[inventoryItemIndex].amount <= 0) {
//             character.inventory.splice(inventoryItemIndex, 1);
//         }

//         // Add Coin
//         totalSellPrice += sellRequest.amount * itemTable[codexItemIndex].sellPrice;
//     }
// }

module.exports.Query = Query;

