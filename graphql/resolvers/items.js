const { UserInputError } = require('apollo-server');
const { itemTypeId } = require('../../constants');
const Item = require('../../models/Item');

var Query = {};

Query.getItem = async (_, { itemId }, context) => {
    var item = {};
    await Item.findById(itemId, (err, res) => {
        if (err) {
            throw new UserInputError('Could not find the requested Item', {
                error: err
            });
        }
        item = res;
    });

    return item;
}

module.exports.Query = Query;