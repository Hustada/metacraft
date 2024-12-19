interface SiteCharacteristics {
  hasProductGrid: boolean;
  hasArticles: boolean;
  hasDashboard: boolean;
  hasSocialFeatures: boolean;
  hasDocumentation: boolean;
}

export type SiteType = 'ecommerce' | 'blog' | 'dashboard' | 'social' | 'documentation' | 'general';

export const detectSiteType = (html: string): SiteType => {
  const characteristics: SiteCharacteristics = {
    hasProductGrid: false,
    hasArticles: false,
    hasDashboard: false,
    hasSocialFeatures: false,
    hasDocumentation: false,
  };

  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Check for e-commerce characteristics
  characteristics.hasProductGrid = Boolean(
    doc.querySelector('.products, .product-grid, [class*="product-list"]') ||
    doc.querySelectorAll('[class*="price"], .cart, .add-to-cart').length > 2
  );

  // Check for blog/article characteristics
  characteristics.hasArticles = Boolean(
    doc.querySelector('article') ||
    (doc.querySelector('main, .content') &&
      doc.querySelectorAll('h1, h2').length > 0 &&
      doc.querySelectorAll('p').length > 3)
  );

  // Check for dashboard characteristics
  characteristics.hasDashboard = Boolean(
    doc.querySelector('.dashboard, .admin-panel, .stats, .widgets') ||
    doc.querySelectorAll('.chart, .graph, .metric').length > 1
  );

  // Check for social media characteristics
  characteristics.hasSocialFeatures = Boolean(
    doc.querySelector('.feed, .timeline, .post, .tweet') ||
    doc.querySelectorAll('.like, .share, .comment, .follow').length > 2
  );

  // Check for documentation characteristics
  characteristics.hasDocumentation = Boolean(
    doc.querySelector('.docs, .documentation, .wiki') ||
    doc.querySelectorAll('code, pre, .api-reference').length > 2
  );

  // Determine the most likely site type
  if (characteristics.hasProductGrid) return 'ecommerce';
  if (characteristics.hasArticles) return 'blog';
  if (characteristics.hasDashboard) return 'dashboard';
  if (characteristics.hasSocialFeatures) return 'social';
  if (characteristics.hasDocumentation) return 'documentation';
  
  return 'general';
};
