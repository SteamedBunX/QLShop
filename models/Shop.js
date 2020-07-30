const { model, Schema } = require('mongoose');

const shopSchema = new Schema({
    name: String,
    minimiumBattleCount: Number,
    shopKeeperName: String,
    inventory: [
        {
            purchasePrice: Number,
            itemId: String
        }
    ]
});

module.exports = model('Shop', shopSchema);
