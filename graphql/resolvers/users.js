const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../../config');
const User = require('../../models/User');
const Character = require('../../models/Character')
const { UserInputError, AuthenticationError } = require('apollo-server');
const { validateUserInfoInput } = require('../../util/validators');
const checkAuth = require('../../util/check-auth');

var Mutation = {};
var Query = {};

Query.getUser = async (_, {}, context) => {
    const tokenData = checkAuth(context);
    const user = await User.findById(tokenData.id);
    if (!user) {
        throw new AuthenticationError('Unable to find the user for the token');
    }
    const characterId = user.character;
    var character;
    if(characterId) {
        await Character.findById(characterId, (err, res) => {
            if(!err) {
             character = res;
            }
        }); 
    }

    return {
        ...user._doc,
        id: user.id,
        character
    };
}

Mutation.register = async (_, { username, password }, context, info) => {
    // TODO: Validate User Input
    const { valid, errors } = validateUserInfoInput(username, password);
    if (!valid) {
        throw new UserInputError('Invalid Input', { errors });
    }
    // TODO: Check if user already exist.
    const user = await User.findOne({ username });
    if (user) {
        throw new UserInputError('Username already exist.', {
            errors: {
                username: 'This username is already taken.'
            }
        })
    }
    // Create User
    password = await bcrypt.hash(password, 12);
    const newUser = new User({ username, password, createdAt: new Date().toISOString() });
    const res = await newUser.save();
    const token = generateToken(res.id, username, password);

    return {
        username: res.username,
        id: res.id,
        token,
        createdAt: res.createdAt
    };
}

Mutation.login = async (_, { username, password }, context, info) => {
    // TODO: Validate User Input
    const { valid, errors } = validateUserInfoInput(username, password);
    if (!valid) {
        throw new UserInputError('Invalid Input', { errors });
    }
    // TODO: Check if user already exist.
    const user = await User.findOne({ username });
    if (!user) {
        throw new UserInputError('Username doesn\'t exist.', {
            errors: {
                username: 'This username does not exist.'
            }
        });
    }
    // Create User
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new UserInputError('Credential does not match', {
            errors: {
                password: 'Credential does not match'
            }
        });
    }

    const token = generateToken(user.id, user.username, user.password);

    return {
        id: user.id,
        username: user.username,
        token,
        createdAt: user.createdAt
    };
}



Mutation.createNewCharacter = async (_, { characterName }, context) => {

    const tokenData = checkAuth(context);
    const user = await User.findById(tokenData.id);
    if (!user) {
        throw new AuthenticationError('Unable to find the user for the token');
    }

    if (characterName.trim() === '') {
        throw new UserInputError('Empty comment', {
            errors: {
                body: 'Character Name must not empty'
            }
        });
    }

    const oldCharacterId = user.character;
    if(oldCharacterId) {
        Character.findByIdAndDelete(oldCharacterId, (err, res) => {
            if(err) {
                console.log('failed to delete the Old Character', err);
            }
        }); 
    }

    const newCharacter = new Character({ name: characterName, coins: 100, battleCount: 0 });
    await newCharacter.save();
    user.character = newCharacter;
    console.log(newCharacter);
    const res = await user.save();
    return {
        ...user._doc,
        id: user.id,
        character: newCharacter
    };
}

module.exports.Mutation = Mutation;
module.exports.Query = Query;

function generateToken(id, username, password) {
    return jwt.sign({
        id: id,
        username: username,
        password: password
    }, JWT_KEY, { expiresIn: '1h' });
}
