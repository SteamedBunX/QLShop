const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
    name: String,
    typeId: Number,
    gearTypeId: Number,
    description: String,
    attributes: [
        {
            name: String,
            value: String,
        }
    ],
    effect: String,
    cooldown: Number,
    sellPrice: Number,
});

module.exports = model('Item', itemSchema);
