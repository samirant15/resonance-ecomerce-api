import { getUserByEmail } from '../airtable/userService';
import AuthError from '../exceptions/AuthError';
import { parseFields } from '../graphql/user';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Auth
export const authenticate = async (email, password) => {
    let user = await getUserByEmail(email);
    user = parseFields(user);

    if (validatePassword(password, user.password) !== true) {
        throw new AuthError('Wrong email or password. Please check values and try again.');
    }

    const token = generateJWT(user);
    return {
        ...user,
        password: undefined,
        token: token,
    }
}

// Password
export const hashPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, SALT_ROUNDS);
}

export const validatePassword = (plainPassword, hash) => {
    return bcrypt.compareSync(plainPassword, hash);
}

// JWT
export const generateJWT = ({ id, firstName, lastName, email, username, }) => {
    return jwt.sign(
        {
            id,
            firstName,
            lastName,
            email,
            username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

export const getUserFromJWT = async (token) => {
    if (!token)
        throw new AuthError('You must be logged in!', 401);
    const user = await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err)
            throw new AuthError('Invalid session. Please login to continue!', 401);

        return decoded;
    });
    return user;
}
