const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../../config');
const User = require('../../models/User');
const { UserInputError } = require('apollo-server');
const { validateUserInfoInput } = require('../../util/validators');
const checkAuth = require('../../util/check-auth');

var Mutation = {};

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

Mutation.createCharacter = async (_, { characterName }, context) => {
    const user = checkAuth(context);
    return "";
}

module.exports.Mutation = Mutation;

function generateToken(id, username, password) {
    return jwt.sign({
        id: id,
        username: username,
        password: password
    }, JWT_KEY, { expiresIn: '1h' });
}
