const { GraphQLObjectType, GraphQLString } = require('graphql');
import { saveUser } from '../airtable/userService';
import { authenticate, getUserFromJWT } from '../common/securityService';

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString },
    })
});

const fieldsMapping = {
    "id": "id",
    "First Name": "firstName",
    "Last Name": "lastName",
    "email": "email",
    "username": "username",
    "Password": "password",
    "token": "token",
}

export const parseFields = (data) => {
    let parsed = {};
    for (const [key, value] of Object.entries(data)) {
        parsed[fieldsMapping[key]] = value;
    }
    return parsed;
}

export const queryFields = {
    /**
     * login(email: "user@gmail.com", password: "123")
     */
    login: {
        type: UserType,
        args: {
            email: { type: GraphQLString },
            password: { type: GraphQLString },
        },
        async resolve(_, args) {
            try {
                const user = await authenticate(args.email, args.password);
                return user;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
    /**
     * signup(firstName: "Pepe", email: "user@gmail.com", password: "123"...)
     */
    signup: {
        type: UserType,
        args: {
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            email: { type: GraphQLString },
            username: { type: GraphQLString },
            password: { type: GraphQLString },
            confirmPassword: { type: GraphQLString },
        },
        async resolve(_, args) {
            try {
                if (args.password !== args.confirmPassword)
                    throw ('Passwords do not match.');

                let user = await saveUser(args);
                user = await authenticate(args.email, args.password);
                return user;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
    /**
     * me()
     */
    me: {
        type: UserType,
        async resolve(_, args, context) {
            try {
                let user = await getUserFromJWT(context.token);
                return { ...user, token: context.token };
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
}