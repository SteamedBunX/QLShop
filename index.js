// Imports
// -GraphQL
const { ApolloServer } = require('apollo-server');
// -GraphQL Constants
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');
// -Mongoose
const mongoose = require('mongoose');

// -Constants
const { MONGODB_CONNECT_STRING } = require('./config');
// -Functions

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    playground: true
});

mongoose.connect(MONGODB_CONNECT_STRING, { useNewUrlParser: true })
    .then(() => {
        return server.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`Server running at : ${res.url}`);
    });