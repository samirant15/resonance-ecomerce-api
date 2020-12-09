const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

export const PictureType = new GraphQLObjectType({
    name: 'PictureType',
    fields: () => ({
        id: { type: GraphQLString },
        url: { type: GraphQLString },
        filename: { type: GraphQLString },
        size: { type: GraphQLInt },
        type: { type: GraphQLString },
        thumbnails: {
            type: new GraphQLObjectType({
                name: 'thumbnailsType',
                fields: () => ({
                    small: { type: ThumbnailType },
                    large: { type: ThumbnailType },
                })
            })
        },
    })
});

export const ThumbnailType = new GraphQLObjectType({
    name: 'ThumbnailType',
    fields: () => ({
        url: { type: GraphQLString },
        width: { type: GraphQLInt },
        height: { type: GraphQLInt },
    })
})