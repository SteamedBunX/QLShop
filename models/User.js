const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    createdAt: String,
    characters: {
        type: Schema.Types.ObjectId,
        ref: 'characters'
      }
});

module.exports = model('User', userSchema);