const usersResolvers = require('./users');

module.exports = {
    Query: {
        helloWorld: () => {
            return 'Hello World!';
        }
    },
    Mutation: {
        ...usersResolvers.Mutation,
    }
};