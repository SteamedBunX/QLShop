const { model, Schema } = require('mongoose');

const shopSchema = new Schema({
    name: String,
    minimiumBattleCount: Number,
    ownerName: String,
    inventory: [
        {
            purchasePrice: Number,
            item: {
                type: Schema.Types.ObjectId,
                ref: 'characters'
            }
        }
    ]
});

module.exports = model('Shop', shopSchema);