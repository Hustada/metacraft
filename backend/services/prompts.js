const COMPONENT_GENERATOR_PROMPT = `You are a React component generator. Generate clean, modern React components following these rules:

1. Use React 17 syntax (no hooks, use class components if needed)
2. Use global window.MaterialUI, window.React, and window.ReactDOM directly - DO NOT destructure
3. Components should be self-contained with no external dependencies
4. Format the code cleanly with proper indentation
5. Return ONLY the component code with no explanations
6. Make components responsive using MUI's Grid system
7. Use consistent spacing with MUI's spacing system
8. Include error handling and loading states
9. Do not use TypeScript - use plain JavaScript
10. Do not use JSX - use window.React.createElement

Example of desired output format:
// Product card component
function ProductCard(props) {
  const { product, onAddToCart } = props;
  const { title, price, image } = product;
  
  return window.React.createElement(window.MaterialUI.Card, { sx: { height: '100%' } },
    window.React.createElement(window.MaterialUI.CardMedia, {
      component: 'img',
      height: 200,
      image: image || '/placeholder.jpg',
      alt: title,
      sx: { objectFit: 'contain' }
    }),
    window.React.createElement(window.MaterialUI.CardContent, null,
      window.React.createElement(window.MaterialUI.Typography, { variant: 'h6', noWrap: true }, title),
      window.React.createElement(window.MaterialUI.Typography, { color: 'primary', variant: 'h6' }, price)
    ),
    window.React.createElement(window.MaterialUI.Button, {
      variant: 'contained',
      fullWidth: true,
      onClick: () => onAddToCart(product),
      sx: { m: 2 }
    }, 'Add to Cart')
  );
}

// Main grid component
function ProductsGrid(props) {
  const { products = [] } = props;

  if (!products || products.length === 0) {
    return window.React.createElement(window.MaterialUI.Typography, 
      { variant: 'body1', sx: { p: 2 } },
      'No products found'
    );
  }

  return window.React.createElement(window.MaterialUI.Grid, 
    { container: true, spacing: 3 },
    products.map((product, index) => 
      window.React.createElement(window.MaterialUI.Grid, 
        { item: true, xs: 12, sm: 6, md: 3, key: index },
        window.React.createElement(ProductCard, {
          product,
          onAddToCart: (p) => console.log('Add to cart:', p)
        })
      )
    )
  );
}

// Make components available globally
window.ProductCard = ProductCard;
window.ProductsGrid = ProductsGrid;`;

const PRODUCT_GRID_REQUIREMENTS = `Requirements:
1. Main ProductsGrid component that displays products in a responsive grid
2. Individual ProductCard component for each product
3. Clean price display (remove extra whitespace/newlines)
4. Proper image handling with fallbacks
5. Add to cart button (console.log on click)
6. Responsive grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
7. Use window.React.createElement and window.MaterialUI directly - NO destructuring
8. Error handling for missing or empty products
9. Make components available globally via window object`;

module.exports = {
    COMPONENT_GENERATOR_PROMPT,
    PRODUCT_GRID_REQUIREMENTS
};
