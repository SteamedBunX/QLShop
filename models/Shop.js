const { model, Schema } = require('mongoose');

const shopSchema = new Schema({
    _id: Number,
    name: String,
    minimiumBattleCount: Number,
    shopKeeper: String,
    inventory: [
        {
            purchasePrice: Number,
            itemId: String
        }
    ]
});

module.exports = model('Shop', shopSchema);
