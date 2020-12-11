import getAirTableBase, { airTableRestRequest } from '.';

const baseName = 'Furniture';

const getFurnitureBase = () => {
    const airTableBase = getAirTableBase();
    return airTableBase(baseName);
}

export const getFurniture = (id) => {
    const furniture = getFurnitureBase();
    return furniture.find(id);
}

export const getFurnitures = (offset) => {
    // To load a list with controlled pagination we need to consume the rest API
    return airTableRestRequest({
        base: baseName,
        method: 'get',
        params: {
            pageSize: 8,
            offset: offset
        }
    });

}