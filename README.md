# Product Filtering

## Overview
This project implements a user interface for filtering products based on properties, operators, and values. The application allows creating dynamic filters that update the product list in real-time with a single filter condition format: `[property] [operator] [value]`.

## How to Run
This project was build with Node v23.11.0
```bash
# Installation
npm install

# Development server
npm run dev

# Testing
npm run test

# Build for production
npm run build
```

## Development Time
**Total:** 17 hours over 2-3 days

### Analysis & Planning (1 hour)
- Initial analysis and planning: 1 hour

### Implementation (13 hours)
- Core implementation (monolithic)
- Filter system development
- Filter logic implementation
- UI/UX improvements and edge cases
- Clear functionality
- Code refactoring and optimization
- Styling and visual polish

### Testing & Validation (2 hours)
- Unit testing

### Documentation (1 hour)
- README and code documentation


## Technology Stack
- **React 18** - Component-based UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Pure CSS** - No external UI libraries, custom styling
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities

### Technology Choices Rationale
- **Pure HTML elements**: Used native `table`, `input`, `select`, and `button` elements for simplicity
- **No UI libraries**: Avoided external dependencies to demonstrate fundamental skills
- **CSS over SCSS**: Pure CSS was sufficient for this project scope
- **Jest over Vitest**: Leveraged existing experience for faster development


## Assumptions Made

1. **Single Filter Scope**: Only one active filter at a time as per specification
2. **Data Integrity**: Products have unique IDs; property_values can be empty arrays
3. **Null Handling**: Products without property values treated as `null`
4. **String Comparisons**: Case-insensitive for better user experience
5. **Performance**: Small dataset doesn't require debouncing
6. **Validation**: Datastore returns well-formed, valid data


## Architecture and Design Decisions

### Project Structure
```
/src
  /assets
    - react.svg
  /components
    - FilterPanel.tsx       # Filter controls container
    - ProductTable.tsx      # Product list display
  /hooks
    /__tests__
      - useFilteredList.test.ts
    - useFilteredList.ts    # Core filtering logic and state
  /services
    - productsDatastore.ts  # Data access layer
  /types
    - general.ts            # TypeScript definitions
  - App.tsx
  - App.css               # App-specific styles
  - index.css             # Base HTML component styles
```

### Key Architectural Decisions

#### 1. TypeScript for Type Safety
Chose TypeScript to ensure type safety across the application, especially important for:
- Datastore interface definitions
- Filter state management
- Component prop validation
- Operator/property type mappings

#### 2. React + Vite for Dynamic Forms
**React** provides excellent support for dynamic form components where:
- Operator dropdown changes based on selected property type
- Value input component adapts to selected operator requirements
- State management handles complex filter updates efficiently

**Vite** offers:
- Lightning-fast development server
- Out-of-the-box TypeScript support
- Excellent developer experience

#### 3. Operator-Property Type Mapping
Implemented a function that dynamically filters valid operators based on selected property type:

```typescript
// Filter valid operators by selected property type
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
```

This approach provides:
- **Type safety**: Ensures only valid operators are available
- **Dynamic UI**: Operator dropdown updates automatically when property changes
- **Specification compliance**: Matches exactly the requirements table
- **Simple maintenance**: Easy to modify operator rules if needed

## Key Design Decisions

### 1. Monolithic-First Approach
Started with a single component containing all logic, then refactored for several reasons:
- **Faster Initial Development**: Get working solution quickly
- **Better Understanding**: See all interactions before abstracting  
- **Easier Debugging**: All logic in one place during development
- **Strategic Refactoring**: Extract components when architecture becomes clear

### 2. Progressive Enhancement Strategy
Built features incrementally in logical order:
1. Display all products → 2. Property selection → 3. Operator filtering → 4. Value inputs → 5. Filter logic

### 3. User Experience Decisions
- **Conditional Rendering**: Value inputs only appear when needed
- **Cascade Resets**: Changing property resets operator and value
- **Clear-on-Empty**: Empty input automatically shows all products
- **Smart Defaults**: Reasonable initial states for better UX

### 4. Testing Philosophy
- **Focus on Business Logic**: Concentrated testing on `useFilteredList` hook
- **Mock External Dependencies**: Isolated unit tests with controlled data.

## Development Process

### Phase 1: Analysis and Strategic Planning
1. **Deep Requirements Analysis**
   - Thoroughly read and analyzed the specification document
   - Created todo list
   - Mapped out edge cases and requirements
   - Identified potential challenges before coding

### Phase 2: Monolithic Implementation
**Strategy**: Started with everything in a single component to establish core functionality quickly
1. **State Management Setup**
   - Defined all necessary state variables
   - Established data flow patterns
2. **Basic UI Structure**  
   - Implemented filter controls (showing all data initially)
   - Created basic table structure
   - Ensured all products display correctly by default

### Phase 3: Dynamic Filter System
Built the filter system incrementally:
1. **Property Selection**: Display available properties
2. **Dynamic Operators**: Show only valid operators based on selected property type
3. **Conditional Value Input**: 
   - Display property values dropdown when applicable (enumerated types)
   - Show appropriate input type (string/number) based on property and operator

### Phase 4: Filter Logic Implementation
**Most complex phase** - Required careful analysis of specification:
1. **Operator Implementation**: Built each of the 7 operators according to spec
2. **Value Handling**: Distinguished between property_values and simple input values
3. **Edge Case Analysis**: Studied examples thoroughly to understand expected behavior
4. **Testing & Validation**: Verified each operator works correctly

### Phase 5: UX Enhancement 
Improved user experience based on testing:
- Value input only appears after operator selection
- Resetting dependent fields when parent selections change
- Clearing input shows all products (expected behavior)
- Other usability improvements discovered during manual testing

### Phase 6: Clear Functionality
Implemented comprehensive filter clearing that resets all state properly

### Phase 7: Code Refactoring and Architecture
**Major refactoring for maintainability and testability**:
1. **Component Extraction**:
   - `FilterPanel.tsx`: Filter controls and logic
   - `ProductTable.tsx`: Product display component
2. **Custom Hook Creation**:
   - `useFilteredList`: Isolated data loading, state management, and filtering logic
3. **Service Layer**:
   - `productsDatastore.ts`: Data access functions
4. **Performance Optimization**:
   - Implemented `useMemo` for expensive computations
   - Optimized re-rendering patterns

### Phase 8: Unit Testing
1. **Testing Strategy**: Focused on `useFilteredList` hook as core business logic
2. **Test Coverage**: Covered key scenarios
3. **Mock Implementation**: Used mocked data for isolated testing
4. **Future Considerations**: Noted need for extensive UI testing and E2E tests in production

### Phase 9: Styling and Visual Polish
1. **CSS Architecture**:
   - `index.css`: Base HTML component styles (global)
   - `App.css`: Application-specific styles
2. **Design Approach**: Pure CSS without external libraries
3. **Lightly Responsive Design**: It works in mobile devices, but with more time the experience would be truly responsive

## Future Improvements

Given more time, I would implement:

### **Immediate Enhancements**
1. **Comprehensive Testing**: 
   - Extensive UI component testing
   - End-to-end testing with Cypress/Playwright
   - Edge case coverage expansion

2. **Enhanced Architecture**:
   - CSS Modules for component-scoped styling
   - SCSS for more advanced styling capabilities
   - Component library integration (e.g. Material-UI) for larger projects

### **Advanced Features**
3. **Multiple Filters**: AND/OR logic between multiple filter conditions
4. **Performance Optimizations**: 
   - Virtual scrolling for large datasets
   - Debounced input handling
5. **Persistence**: Save filters to localStorage or URL parameters
6. **Advanced UI**: 
   - Saved filter presets∏
   - Export filtered results

### **Production Readiness**
7. **Accessibility**: Enhanced screen reader support and keyboard navigation
8. **Internationalization**: Multi-language support
9. **Error Handling**: Comprehensive error boundaries and user feedback
10. **Documentation**: Storybook for component documentation


## Final Notes
This README file was co-written with AI.