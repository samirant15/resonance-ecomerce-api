import { queryFields as furnitureQueryFields } from './furniture';
import { queryFields as userQueryFields } from './user';
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: {
        ...furnitureQueryFields,
        ...userQueryFields,
    }
})

const schema = new GraphQLSchema({
    query: rootQuery,
});

export default schema;