const { UserInputError } = require('apollo-server');
const { itemTypeId, gearGroupId } = require('../../constants');
const Item = require('../../models/Item');

var Query = {};
var TypeResolver = {};

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

TypeResolver.Item = {};
TypeResolver.Item.__resolveType = (item, context, info) => {
    switch (item.typeId) {
        case itemTypeId.GEAR:
            return 'Gear';
        case itemTypeId.CONSUMABLE:
            return 'Consumable';
        case itemTypeId.MATERIAL:
            return 'Material';
    }
}

module.exports.Query = Query;

module.exports.TypeResolver = TypeResolver;

Array.prototype.forEachAsync = async function (fn) {
    for (let t of this) { await fn(t) }
}