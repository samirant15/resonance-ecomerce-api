import getAirTableBase from '.';
import { hashPassword } from '../common/securityService';

const baseName = 'Users';

const getUsersBase = () => {
    const airTableBase = getAirTableBase();
    return airTableBase(baseName);
}

export const getUser = (id) => {
    const user = getUsersBase();
    return user.find(id);
}

export const getUserByEmail = (email) => {
    const user = getUsersBase();
    return new Promise((resolve, reject) => {
        user.select({
            maxRecords: 1,
            filterByFormula: `{email} = "${email}"`
        }).eachPage(function page(records, fetchNextPage) {
            if (records.length == 0)
                return reject('User not found.');
            else if (records.length > 1)
                return reject('An internal error has occurred! Please contact the administrator.');
            const user = records[0];
            resolve({ id: user.id, ...user.fields });
        }, function done(err) {
            console.error(err);
            reject(err.message);
        });
    });
}

export const saveUser = (data) => {

    const info = [
        {
            "id": data.id,
            fields: {
                "Password": hashPassword(data.password),
                "First Name": data.firstName,
                "Last Name": data.lastName,
                "email": data.email,
                "username": data.username,
            }
        }
    ]

    const user = getUsersBase();
    return data.id ? user.update(info) : user.create(info);
}