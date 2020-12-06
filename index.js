import schema from './src/graphql';

var express = require('express');
var dotenv = require('dotenv');
var { graphqlHTTP } = require('express-graphql');

dotenv.config();
var app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(process.env.APP_PORT);
console.log(`Running Resonance E-Comerce API at port ${process.env.APP_PORT}!`);