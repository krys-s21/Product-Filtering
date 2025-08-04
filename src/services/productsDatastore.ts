import type { Property, Product, Operator } from "../types/general";

const getProperties = () => {
    const propertiesData: Property[] = (window as any)['datastore'].getProperties();
    return propertiesData;
};

const getProducts = () => {
    const products: Product[] = (window as any)['datastore'].getProducts();
    return products;
};

// Get operators and set operators state
const getPropertyValidOperators = (selectedPropertyObject: Property) => {
    const operatorsData: Operator[] = (window as any)['datastore'].getOperators();
    const filteredOperators = operatorsData.filter(operator => getOperatorsByPropertyType(selectedPropertyObject)?.includes(operator.id));
    return filteredOperators;
};

//Filter valid operators by selected property type
const getOperatorsByPropertyType = (selectedPropertyObject: Property) => {
    switch (selectedPropertyObject?.type) {
        case 'string':
            return ["equals", "any", "none", "in", "contains"];
        case 'number':
            return ["equals", "greater_than", "less_than", "any", "none", "in"];
        case 'enumerated':
            return ["equals", "any", "none", "in"];
    }
}

export { getProperties, getProducts, getPropertyValidOperators }