
import { useEffect, useMemo, useState } from "react";
import type { Property, Operator, Product } from "../types/general";
import { getProducts, getProperties, getPropertyValidOperators } from "../services/productsDatastore";

const useFilteredList = () => {

    const properties = useMemo(() => getProperties(), []);
    const products = useMemo(() => getProducts(), []);

    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

    const [operators, setOperators] = useState<Operator[]>([]);
    const [propertyValues, setPropertyValues] = useState<string[]>([]);

    // for selected filters
    const [selectedProperty, setSelectedProperty] = useState<Property>();
    const [selectedOperatorId, setSelectedOperatorId] = useState<string>();
    const [selectedPropertyValues, setSelectedPropertyValues] = useState<string[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | number>();


    useEffect(() => {
        getProperties();
        getProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [selectedPropertyValues, selectedValue]);


    const filterUsingOperator = applyFilters(selectedPropertyValues, selectedOperatorId, products, selectedProperty, selectedValue)

    // Get operators and set operators state
    const prepareOperators = (selectedPropertyObject: Property) => {
        setOperators(getPropertyValidOperators(selectedPropertyObject));
    };

    // Handle filters change - property
    const handleChangeProperty = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!event.target.value) return;

        //reset selected values
        setSelectedOperatorId(undefined);
        setSelectedPropertyValues([]);
        setSelectedValue(undefined);

        // get object
        const selectedPropertyObject = properties.find(item => item.id === Number(event.target.value));
        if (!selectedPropertyObject) return;
        setSelectedProperty(selectedPropertyObject);

        // set operations
        prepareOperators(selectedPropertyObject);

        // set property values
        setPropertyValues(selectedPropertyObject?.values ?? []);
    }

    // Handle filters change - operator
    const handleChangeOperator = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOperatorId(event.target.value);

        //reset
        setSelectedPropertyValues([]);
        setSelectedValue(undefined);
    }
    // Handle filters change - property_values
    const handleChangePropertyValues = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions);
        const values = selectedOptions.map(option => option.value)
        setSelectedPropertyValues(values);
    }
    // Handle filters change - value
    const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "") setFilteredProducts(products);
        const typifiedValue = selectedProperty?.type === "number" &&
            selectedOperatorId !== "in" ? Number(event.target.value) : event.target.value;
        setSelectedValue(typifiedValue);
    }

    const handleClearClick = () => {
        setSelectedProperty(undefined);
        setSelectedOperatorId(undefined);
        setSelectedValue(undefined);
        setSelectedPropertyValues([]);
        setFilteredProducts(products);

        setOperators([]);
        setPropertyValues([]);
    }


    // Filter products and set products state
    const filterProducts = () => {
        if (!selectedProperty || !selectedOperatorId || (propertyValues.length === 0 && !selectedValue)) return;

        const productsFiltered = filterUsingOperator();
        setFilteredProducts(productsFiltered ?? []);
    };
    return ({
        properties,
        operators,
        propertyValues,
        filteredProducts,
        filterValues: { selectedProperty, selectedOperatorId, selectedPropertyValues, selectedValue },
        handleChangeProperty,
        handleChangeOperator,
        handleChangePropertyValues,
        handleChangeValue,
        handleClearClick
    });
}

function applyFilters(selectedPropertyValues: string[], selectedOperatorId: string | undefined, products: Product[], selectedProperty: Property | undefined, selectedValue: string | number | undefined) {
    return () => {
        if (selectedPropertyValues.length > 0) {
            switch (selectedOperatorId) {
                case "equals":
                case "in":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        selectedPropertyValues.includes(String(property_value.value))));
                case "any":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        selectedPropertyValues.some(v => v.includes(String(property_value.value)))));
                case "none":
                    return products.filter(product => !product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        selectedPropertyValues.some(v => v.includes(String(property_value.value)))));
            }
        } else if (selectedValue) {
            switch (selectedOperatorId) {
                case "equals":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        selectedValue === property_value.value)
                    );
                case "greater_than":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        selectedValue < property_value.value));
                case "less_than":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        selectedValue > property_value.value));
                case "any":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        String(property_value.value).includes(String(selectedValue))));
                case "none":
                    return products.filter(product => !product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        String(property_value.value).includes(String(selectedValue))));
                case "in":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        String(selectedValue).split(',').map(v => v.trim()).includes(String(property_value.value))));
                case "contains":
                    return products.filter(product => product.property_values.some(property_value => property_value.property_id === selectedProperty?.id &&
                        String(property_value.value).toLowerCase().includes(String(selectedValue).toLowerCase())));
            }
        }
    };
}

export { useFilteredList }

