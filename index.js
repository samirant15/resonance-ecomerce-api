import schema from './src/graphql';

var express = require('express');
var dotenv = require('dotenv');
var cors = require('cors')
var { graphqlHTTP } = require('express-graphql');
var fs = require('fs');
var https = require('https');

// SSL
var privateKey = fs.readFileSync(__dirname + '/certificate/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/certificate/server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

dotenv.config();
var app = express();

app.use(cors());

app.use('/graphql',
    graphqlHTTP((req) => {
        return {
            schema: schema,
            context: { token: req.headers?.authorization ? req.headers?.authorization.replace('Bearer ', '') : null },
            graphiql: true,
            customFormatErrorFn: (error) => ({
                message: error.message,
                code: error.extensions?.code,
                locations: process.env.DEV_MODE === 'true' ? error.locations : undefined,
                stack: process.env.DEV_MODE === 'true' ? (error.stack ? error.stack.split('\n') : []) : undefined,
                path: process.env.DEV_MODE === 'true' ? error.path : undefined,
            })
        };
    }),
);

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.APP_PORT);
console.log(`Running Resonance E-Comerce API at port ${process.env.APP_PORT}!`);
