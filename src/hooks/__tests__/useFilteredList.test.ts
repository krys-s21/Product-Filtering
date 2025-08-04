import { renderHook, act } from '@testing-library/react';
import { useFilteredList } from '../useFilteredList';
import * as productDatastore from '../../services/productsDatastore';
import type { Operator, Product, Property } from '../../types/general';

const productsMock:Product[] = [
  {
    id: 1,
    property_values: [
      { property_id: 1, value: 'Nike' },
      { property_id: 2, value: 100 },
      { property_id: 3, value: 'Shoes' }
    ]
  },
  {
    id: 2,
    property_values: [
      { property_id: 1, value: 'Adidas' },
      { property_id: 2, value: 150 },
      { property_id: 3, value: 'Shoes' }
    ]
  },
  {
    id: 3,
    property_values: [
      { property_id: 1, value: 'Puma' },
      { property_id: 2, value: 80 },
      { property_id: 3, value: 'Clothing' }
    ]
  }
];

const propertiesMock:Property[] =[
    { id: 1, name: 'Brand', type: 'string', values: ['Nike', 'Adidas', 'Puma'] },
    { id: 2, name: 'Price', type: 'number' },
    { id: 3, name: 'Category', type: 'enumerated', values: ['Shoes', 'Clothing', 'Accessories'] }
  ];
const operatorMock: Operator[] = [
      { id: 'equals', text: 'Equals' },
      { id: 'greater_than', text: 'Greater Than' },
      { id: 'less_than', text: 'Less Than' },
      { id: 'contains', text: 'Contains' },
      { id: 'in', text: 'In' },
      { id: 'any', text: 'Any' },
      { id: 'none', text: 'None' }
    ];

describe('useFilteredList', () => {
  beforeEach(() => {
    jest.spyOn(productDatastore, 'getProducts').mockImplementation(() => productsMock);
    jest.spyOn(productDatastore, 'getProperties').mockImplementation(() => propertiesMock);
    jest.spyOn(productDatastore, 'getPropertyValidOperators').mockImplementation(() => operatorMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should initialize with correct default state and load data', () => {
    const { result } = renderHook(() => useFilteredList());

    // Check initial state
    expect(result.current.properties).toEqual(propertiesMock);
    expect(result.current.filteredProducts).toEqual(productsMock);
    expect(result.current.operators).toEqual([]);
    expect(result.current.propertyValues).toEqual([]);

    // Check filter values are undefined initially
    expect(result.current.filterValues.selectedProperty).toBeUndefined();
    expect(result.current.filterValues.selectedOperatorId).toBeUndefined();
    expect(result.current.filterValues.selectedPropertyValues).toEqual([]);
    expect(result.current.filterValues.selectedValue).toBeUndefined();
  });

  it('should handle property selection and load appropriate operators', () => {
    const { result } = renderHook(() => useFilteredList());

    // Mock the event for selecting a property (Brand - string type)
    const mockEvent = {
      target: { value: '1' }
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangeProperty(mockEvent);
    });

    // Check that property was selected
    expect(result.current.filterValues.selectedProperty).toEqual(propertiesMock[0]);

    // Check that operators were loaded for string type property
    // String type should have: equals, any, none, in, contains
    expect(result.current.operators.length).toBeGreaterThan(0);
    expect(result.current.operators.some(op => op.id === 'equals')).toBe(true);
    expect(result.current.operators.some(op => op.id === 'contains')).toBe(true);

    // Check that property values were set
    expect(result.current.propertyValues).toEqual(['Nike', 'Adidas', 'Puma']);

    // Check that other filter values were reset
    expect(result.current.filterValues.selectedOperatorId).toBeUndefined();
    expect(result.current.filterValues.selectedPropertyValues).toEqual([]);
    expect(result.current.filterValues.selectedValue).toBeUndefined();
  });

  it('should filter products correctly based on selected criteria', () => {
    const { result } = renderHook(() => useFilteredList());

    // Select a property (Brand)
    const propertyEvent = {
      target: { value: '1' }
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangeProperty(propertyEvent);
    });

    //  Select an operator (equals)
    const operatorEvent = {
      target: { value: 'equals' }
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangeOperator(operatorEvent);
    });

    // Select property values (Nike)
    const propertyValuesEvent = {
      target: {
        selectedOptions: [{ value: 'Nike' }]
      }
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangePropertyValues(propertyValuesEvent);
    });

    // Check that products are filtered correctly
    // Should only show Nike products (product with id: 1)
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe(1);
    expect(result.current.filteredProducts[0].property_values).toContainEqual({
      property_id: 1,
      value: 'Nike'
    });

    // Test clear functionality
    act(() => {
      result.current.handleClearClick();
    });

    // Check that all filters are reset
    expect(result.current.filterValues.selectedProperty).toBeUndefined();
    expect(result.current.filterValues.selectedOperatorId).toBeUndefined();
    expect(result.current.filterValues.selectedPropertyValues).toEqual([]);
    expect(result.current.filterValues.selectedValue).toBeUndefined();
    expect(result.current.filteredProducts).toEqual(productsMock);
    expect(result.current.operators).toEqual([]);
    expect(result.current.propertyValues).toEqual([]);
  });

  it('should handle numeric value filtering correctly', () => {
    const { result } = renderHook(() => useFilteredList());

    // Select Price property (numeric)
    const propertyEvent = {
      target: { value: '2' }
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangeProperty(propertyEvent);
    });

    // Select greater_than operator
    const operatorEvent = {
      target: { value: 'greater_than' }
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangeOperator(operatorEvent);
    });

    // Set numeric value (100)
    const valueEvent = {
      target: { value: '100' }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChangeValue(valueEvent);
    });

    // Should filter products with price > 100 (only Adidas with price 150)
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe(2);
    expect(result.current.filterValues.selectedValue).toBe(100); // Should be converted to number
  });

  it('should handle edge cases and invalid inputs correctly', () => {
    const { result } = renderHook(() => useFilteredList());

    // Test empty property selection
    const emptyPropertyEvent = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangeProperty(emptyPropertyEvent);
    });

    // Should not change state for empty value
    expect(result.current.filterValues.selectedProperty).toBeUndefined();

    // Test invalid property ID
    const invalidPropertyEvent = {
      target: { value: '999' }
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChangeProperty(invalidPropertyEvent);
    });

    // Should not set property for invalid ID
    expect(result.current.filterValues.selectedProperty).toBeUndefined();

    // Test empty value input
    const emptyValueEvent = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChangeValue(emptyValueEvent);
    });

    // Should reset filtered products to all products when value is empty
    expect(result.current.filteredProducts).toEqual(productsMock);
  });
});
