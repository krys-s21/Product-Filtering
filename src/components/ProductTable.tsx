import React from 'react';
import type { Property, Product } from '../types/general';

interface ProductTableProps {
  properties: Property[];
  filteredProducts: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({
  properties,
  filteredProducts
}) => {
  // Helper function to get property value for a product
  const getPropertyValue = (product: Product, propertyId: number): string | number => {
    const propertyValue = product.property_values.find(pv => pv.property_id === propertyId);
    return propertyValue?.value ?? '-';
  };

  return (
    <div className="product-table-container">
      <div className="table-header">
        <h3>Products ({filteredProducts.length})</h3>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found matching the current filters.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="product-filtering__products-table">
            <thead>
              <tr>
                <th className="product-id-column">ID</th>
                {properties.map((property) => (
                  <th key={property.id} className={`property-column property-${property.type}`}>
                    <div className="column-header">
                      <span className="property-name">{property.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="product-row">
                  <td className="product-id-cell">{product.id}</td>
                  {properties.map((property) => (
                    <td 
                      key={`${product.id}-${property.id}`} 
                      className={`property-cell property-${property.type}`}
                    >
                      {getPropertyValue(product, property.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
