const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
    name: String,
    description: String,
    attributes: [
        {
            name: String,
            value: String
        }
    ]
});

module.exports = model('Item', itemSchema);