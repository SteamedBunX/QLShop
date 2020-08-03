const checkAuth = require('../../util/check-auth');
const getCharacter = require(`../../util/get-character`);
const User = require('../../models/User');
const Character = require('../../models/Character');
const Shop = require('../../models/Shop');
const { UserInputError, AuthenticationError } = require('apollo-server');

var Query = {};

Query.getShops = async (_, {shopIds}) => {
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

module.exports.Query = Query;

