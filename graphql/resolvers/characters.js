const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../../config');
const User = require('../../models/User');
const Character = require('../../models/Character')
const { UserInputError, AuthenticationError } = require('apollo-server');
const checkAuth = require('../../util/check-auth');

var Mutation = {};

Mutation.completeTask = async (_, { totalTimes }, context) => {

    const tokenData = checkAuth(context);
    const user = await User.findById(tokenData.id);
    const character = await Character.findById(user.character);
    if(!totalTimes) {
        totalTimes = 1;
    }

    var totalCoins = character.coins;
    const taskRewards = [];
    for (i = 0; i < totalTimes; i++) {
        var taskReward = Math.floor( Math.random() * 500);
        taskRewards.push(taskReward);
        totalCoins += taskReward;
    }
    character.coins = totalCoins;
    character.battleCount += totalTimes;
    character.save();

    return{
        newTotalCoins: totalCoins,
        taskRewards
    }
}

module.exports.Mutation = Mutation;