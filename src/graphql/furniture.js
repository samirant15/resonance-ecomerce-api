const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLFloat } = require('graphql');
import AirtableError from 'airtable/lib/airtable_error';
import { PictureType } from './picture';
import * as furnitureService from '../airtable/furnitureService';
import { getUserFromJWT } from '../common/securityService';

export const FurnitureType = new GraphQLObjectType({
    name: 'FurnitureType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        picture: { type: GraphQLList(PictureType) },
        vendor: { type: GraphQLList(GraphQLString) },
        type: { type: GraphQLString },
        inStock: { type: GraphQLBoolean },
        schematic: { type: GraphQLList(PictureType) },
        unitCost: { type: GraphQLFloat },
        size: { type: GraphQLString },
        description: { type: GraphQLString },
        designer: { type: GraphQLList(GraphQLString) },
        link: { type: GraphQLString },
        notes: { type: GraphQLString },
        materialsAndFinishes: { type: GraphQLList(GraphQLString) },
        settings: { type: GraphQLList(GraphQLString) },
    })
});

export const PaginationListType = new GraphQLObjectType({
    name: 'PaginationListType',
    fields: () => ({
        records: { type: GraphQLList(FurnitureType) },
        offset: { type: GraphQLString },
    })
});

const fieldsMapping = {
    "id": "id",
    "Name": "name",
    "Picture": "picture",
    "Vendor": "vendor",
    "Type": "type",
    "In Stock": "inStock",
    "Schematic": "schematic",
    "Unit Cost": "unitCost",
    "Size (WxLxH)": "size",
    "Description": "description",
    "Designer": "designer",
    "Link": "link",
    "Notes": "notes",
    "Materials and Finishes": "materialsAndFinishes",
    "Settings": "settings"
}

const parseFields = (data) => {
    let parsed = {};
    for (const [key, value] of Object.entries(data)) {
        parsed[fieldsMapping[key]] = value;
    }
    return parsed;
}

export const queryFields = {
    /**
     * furniture(id: "123") 
     */
    furniture: {
        type: FurnitureType,
        args: {
            id: { type: GraphQLString }
        },
        async resolve(_, args, context) {
            // The following line adds auth validation to this method
            const loggedUser = await getUserFromJWT(context.token);
            try {
                const res = await furnitureService.getFurniture(args.id);
                const data = { id: res.id, ...res.fields };
                return parseFields(data);
            } catch (error) {
                console.error(error);
                if (error instanceof AirtableError) {
                    throw new Error(`${error.message} (${error.error} ERROR)`);
                }
                throw new Error(`An internal error has occurred! Please try again later.`);
            }
        }
    },
    /**
     * furnitures(offset: 'abc') 
     */
    furnitures: {
        type: PaginationListType,
        args: {
            offset: { type: GraphQLString }
        },
        async resolve(_, args, context) {
            // The following line adds auth validation to this method
            const loggedUser = await getUserFromJWT(context.token);
            try {
                const res = await furnitureService.getFurnitures(args.offset);

                if (!res.data?.records) {
                    return [];
                }

                const records = [];
                for (const record of res.data.records) {
                    records.push(parseFields({ id: record.id, ...record.fields }));
                }

                return { records, offset: res.data.offset };
            } catch (error) {
                console.error(error);
                if (error instanceof AirtableError) {
                    throw new Error(`${error.message} (${error.error} ERROR)`);
                }
                throw new Error(`An internal error has occurred! Please try again later.`);
            }
        }
    }
}