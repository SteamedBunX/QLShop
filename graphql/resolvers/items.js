const { UserInputError } = require('apollo-server');
const { itemTypeId } = require('../../constants');
const Item = require('../../models/Item');

var Query = {};

Query.getItems = async (_, { itemIds }, context) => {
    var items = [];
    await itemIds.forEachAsync(async itemId => {
        await Item.findById(itemId, (err, res) => {
            items.push(res);
        });
    });

    if (Array.isArray(items) && items.length) {
        return items;
    }

    throw new UserInputError('Could not find the requested Items');
}

module.exports.Query = Query;

Array.prototype.forEachAsync = async function (fn) {
    for (let t of this) { await fn(t) }
}