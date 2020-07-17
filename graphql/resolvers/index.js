const usersResolvers = require('./users');
const charactersResolvers = require('./characters');
const itemsResolvers = require('./items')

module.exports = {
    Query: {
        ...usersResolvers.Query,
        ...itemsResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...charactersResolvers.Mutation,
    }
};