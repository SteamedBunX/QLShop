const Character = require('../models/Character');

module.exports = async (characterId) => {
    if (characterId) {
        const character = await Character.findById(characterId);
        return character
    }
    throw new Error(`Could not find the character under requested ID`);
}