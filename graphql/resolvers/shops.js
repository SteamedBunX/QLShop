const checkAuth = require('../../util/check-auth');
const getCharacter = require(`../../util/get-character`);
const User = require('../../models/User');
const Character = require('../../models/Character');
const Shop = require('../../models/Shop');
const { UserInputError, AuthenticationError } = require('apollo-server');

var Query = {};

Query.getShops = async (_, {shopIds}) => {
    if(true){
        shops = await Shop.find();
        return shops;
    }
}

module.exports.Query = Query;

