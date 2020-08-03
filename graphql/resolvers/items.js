const { UserInputError } = require('apollo-server');
const { itemTypeId } = require('../../constants');
const Item = require('../../models/Item');

var Query = {};
var TypeResolver = {};

Query.getItems = async (_, { itemIds, typeIds, gearTypeIds }, context) => {
    var items = [];
    var gearIncludedWithType = false;
    if (Array.isArray(itemIds) && itemIds.length) {
        items = await Item.find().where('_id').in(itemIds).exec();
    } else if (Array.isArray(typeIds) && typeIds.length) {
        var indexOfGearType = typeIds.indexOf(0);
        if (indexOfGearType > -1 && Array.isArray(gearTypeIds) && gearTypeIds.length) {
            typeIds.splice(indexOfGearType, 1);
            gearIncludedWithType = true;
        }
        const newTypeSet = await Item.find().where('typeId').in(typeIds);
        items = newTypeSet;
        if (gearIncludedWithType) {
            const newGearSet = await Item.find().where('gearTypeId').in(gearTypeIds);
            items = [...items, ...newGearSet];
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
