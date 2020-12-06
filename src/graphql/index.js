import { queryFields as furnitureQueryFields } from './furniture';
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: {
        ...furnitureQueryFields,
    }
})

const schema = new GraphQLSchema({
    query: rootQuery,
});

export default schema;