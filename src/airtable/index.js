const Airtable = require('airtable');
const axios = require('axios');

var airTableBase = null;
const getAirTableBase = () => {

    if (airTableBase == null) {
        const base = new Airtable({ apiKey: process.env.AIR_TABLE_API_KEY }).base(process.env.AIR_TABLE_BASE_ID);
        airTableBase = base;
    }

    return airTableBase;
}

export const airTableRestRequest = ({ base, method, data, params }) => {
    const route = `${process.env.AIR_TABLE_URL}/${process.env.AIR_TABLE_BASE_ID}/${base}`;
    return axios(
        {
            url: route,
            method: method,
            data: data,
            params: params,
            headers: {
                'Authorization': `Bearer ${process.env.AIR_TABLE_API_KEY}`
            },
            json: true
        }
    )
}

export default getAirTableBase;