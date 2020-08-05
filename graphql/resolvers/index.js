const usersResolvers = require('./users');
const charactersResolvers = require('./characters');
const itemsResolvers = require('./items');
const shopsResolvers = require('./shops');

module.exports = {
    ...itemsResolvers.TypeResolver,
    Query: {
        ...usersResolvers.Query,
        ...itemsResolvers.Query,
        ...charactersResolvers.Query,
        ...shopsResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...charactersResolvers.Mutation,
        ...shopsResolvers.Mutation,
    }
};
