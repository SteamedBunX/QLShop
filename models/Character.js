const { model, Schema } = require('mongoose');

const characterSchema = new Schema({
    characterName: String,
    coins: Number,
    battleCount: Number,
    alive: Boolean
});

module.exports = model('Character', characterSchema);