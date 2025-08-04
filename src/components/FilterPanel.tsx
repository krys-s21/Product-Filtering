import React from 'react';
import type { Property, Operator } from '../types/general';

interface FilterPanelProps {
  properties: Property[];
  operators: Operator[];
  propertyValues: string[];
  filterValues: {
    selectedProperty?: Property;
    selectedOperatorId?: string;
    selectedPropertyValues: string[];
    selectedValue?: string | number;
  };
  valueInputType: string;
  onChangeProperty: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeOperator: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangePropertyValues: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearClick: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  properties,
  operators,
  propertyValues,
  filterValues,
  valueInputType,
  onChangeProperty,
  onChangeOperator,
  onChangePropertyValues,
  onChangeValue,
  onClearClick
}) => {
  const { selectedProperty, selectedOperatorId, selectedPropertyValues } = filterValues;

  return (
    <div className="product-filtering__filters">
      <h3>Table Filters</h3>
      <div>
        <div className="filter-controls">
          <div className="filter-field">
            <label htmlFor="property-select">Property:</label>
            <select
              id="property-select"
              name="property"
              value={selectedProperty?.id ?? ""}
              onChange={onChangeProperty}
              className="filter-select"
            >
              <option value="">Select a Property...</option>
              {properties?.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          {operators.length > 0 && (
            <div className="filter-field">
              <label htmlFor="operator-select">Operator:</label>
              <select
                id="operator-select"
                name="operator"
                value={selectedOperatorId ?? ''}
                onChange={onChangeOperator}
                className="filter-select"
              >
                <option value=''>Select an Operator...</option>
                {operators?.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.text}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedOperatorId && (
            <>
              {propertyValues.length > 0 ? (
                <div className="filter-field">
                  <label htmlFor="property-value-select">Property Value:</label>
                  <select
                    id="property-value-select"
                    name="property_value"
                    value={selectedOperatorId !== "equals" ? selectedPropertyValues : selectedPropertyValues[0] ?? ''}
                    multiple={selectedOperatorId !== "equals"}
                    onChange={onChangePropertyValues}
                    className="filter-select"
                    size={selectedOperatorId !== "equals" ? Math.min(propertyValues.length, 5) : 1}
                  >
                    {propertyValues.map((value: string) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="filter-field">
                  <label htmlFor="value-input">Value:</label>
                  <input
                    id="value-input"
                    type={valueInputType}
                    name="value"
                    onChange={onChangeValue}
                    className="filter-input"
                    placeholder={`Enter ${selectedProperty?.type} value...`}
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        <button 
          onClick={onClearClick}
          className="clear-filters-btn"
          type="button"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};
