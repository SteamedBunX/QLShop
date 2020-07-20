const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
    name: String,
    typeId: Number,
    gearGroupId: Number,
    description: String,
    attributes: [
        {
            name: String,
            value: String,
            isPercentage: Boolean
        }
    ],
    effect: String,
    cooldown: Number,
});

module.exports = model('Item', itemSchema);