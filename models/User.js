const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    createdAt: String,
    characterName: String,
    coins: Number,
    battleCount: Number
});

module.exports = model('User', userSchema);