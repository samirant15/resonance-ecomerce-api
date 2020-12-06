const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLFloat } = require('graphql');

export const FurnitureType = new GraphQLObjectType({
    name: 'FurnitureType',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        picture: { type: GraphQLString },
        vendor: { type: GraphQLString },
        type: { type: GraphQLString },
        inStock: { type: GraphQLBoolean },
        schematic: { type: GraphQLString },
        unitCost: { type: GraphQLFloat },
        size: { type: GraphQLString },
        description: { type: GraphQLString },
        designer: { type: GraphQLString },
        link: { type: GraphQLString },
        notes: { type: GraphQLString },
        materialsAndFinishes: { type: GraphQLString },
        settings: { type: GraphQLString },
    })
});

export const queryFields = {
    furniture: {
        type: FurnitureType,
        args: {
            id: { type: GraphQLInt }
        },
        resolve(parentValue, args) {
            return { id: 1, name: 'test', vendor: 'testing' }
        }
    },
    furnitures: {
        type: new GraphQLList(FurnitureType),
        resolve(parentValue, args) {
            return [{ id: 1, name: 'test', vendor: 'testing' }]
        }
    }
}