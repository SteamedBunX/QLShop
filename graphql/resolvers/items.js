const { UserInputError } = require('apollo-server');
const { itemTypeId } = require('../../constants');
const Item = require('../../models/Item');

var Query = {};
var TypeResolver = {};

Query.getItems = async (_, { itemIds, typeId, gearTypeId }, context) => {
    var items = [];
    var gearIncluded = false;
    if (Array.isArray(itemIds) && itemIds.length) {
        await itemIds.forEachAsync(async itemId => {
            const newItem = await Item.findById(itemId);
            items.push(newItem);
        });
    } else if (Array.isArray(typeId) && typeId.length) {
        await typeId.forEachAsync(async typeId => {
            if (typeId === 0) {
                gearIncluded = true;
            } else {
                const newTypeSet = await Item.find({ typeId });
                items = [...items, ...newTypeSet];
            }
        });
        if (gearIncluded) {
            if (Array.isArray(gearTypeId) && gearTypeId.length) {
                await typeId.forEachAsync(async typeId => {
                    const newGearSet = await Item.find({ gearTypeId });
                    items = [...items, ...newGearSet];
                });
            } else {
                // not type specific.
                const gearSet = await Item.find({ typeId: 0 });
                items = [...items, ...gearSet];

            }
        }
    } else {
        return await Item.find();
    }

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
