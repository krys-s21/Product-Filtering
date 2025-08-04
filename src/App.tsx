import './App.css'
import { useFilteredList } from './hooks/useFilteredList'
import { FilterPanel } from './components/FilterPanel'
import { ProductTable } from './components/ProductTable'

function App() {
  const {
    properties,
    operators,
    propertyValues,
    filteredProducts,
    filterValues,
    handleChangeProperty,
    handleChangeOperator,
    handleChangePropertyValues,
    handleChangeValue,
    handleClearClick
  } = useFilteredList();

  const valueInputType = filterValues.selectedProperty?.type === 'number' && 
    filterValues.selectedOperatorId !== "in" ? 'number' : 'text';

  return (
    <section id="product-filtering">
      <div className="app-header">
        <h1>Product Filtering System</h1>
        <p>Filter and view products based on their properties</p>
      </div>

      <FilterPanel
        properties={properties}
        operators={operators}
        propertyValues={propertyValues}
        filterValues={filterValues}
        valueInputType={valueInputType}
        onChangeProperty={handleChangeProperty}
        onChangeOperator={handleChangeOperator}
        onChangePropertyValues={handleChangePropertyValues}
        onChangeValue={handleChangeValue}
        onClearClick={handleClearClick}
      />

      <ProductTable
        properties={properties}
        filteredProducts={filteredProducts}
      />
    </section>
  )
}

export default App
