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
            await Item.findById(itemId, (err, res) => {
                items.push(res);
            });
        });
    } else if (Array.isArray(typeId) && typeId.length) {
        await typeId.forEachAsync(async typeId => {
            if (typeId === 0) {
                gearIncluded = true;
            } else {
                await Item.find({ typeId }, (err, res) => {
                    items = [...items, ...res];
                });
            }
        });
        if (gearIncluded) {
            if (Array.isArray(gearTypeId) && gearTypeId.length) {
                await typeId.forEachAsync(async typeId => {
                    await Item.find({ gearTypeId }, (err, res) => {
                        items = [...items, ...res];
                    });
                });
            } else {
                await Item.find({ typeId: 0 }, (err, res) => {
                    items = [...items, ...res];
                });
            }
        }
    } else {
        return Item.find();
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