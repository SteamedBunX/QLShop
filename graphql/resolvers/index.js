const usersResolvers = require('./users');
const charactersResolvers = require('./characters');
const itemsResolvers = require('./items')

module.exports = {
    ...itemsResolvers.TypeResolver,
    Query: {
        ...usersResolvers.Query,
        ...itemsResolvers.Query,
        ...charactersResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...charactersResolvers.Mutation,
    }
};
