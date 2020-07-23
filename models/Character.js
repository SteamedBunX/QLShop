const { model, Schema } = require('mongoose');

const characterSchema = new Schema({
    name: String,
    coins: Number,
    battleCount: Number,
    inventory: [{
        itemId: String,
        amount: Number
    }],
});

module.exports = model('Character', characterSchema);
