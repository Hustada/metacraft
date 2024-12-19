function analyzeSEO({ titles, paragraphs, links, metadata }) {
  let score = 100;
  const analysis = {
    titleTag: 'Not found',
    metaDescription: 'Not found',
    headingStructure: 'Missing headings',
    keywordUsage: 'No keywords detected'
  };
  const recommendations = [];

  // Check title
  if (!titles || !titles.length) {
    score -= 15;
    recommendations.push("Add a main heading (H1) to improve SEO");
    analysis.headingStructure = 'Missing main heading';
  } else {
    const h1Count = titles.filter(t => t.type === 'h1').length;
    const hasProperHeadingStructure = titles.every((t, i, arr) => 
      i === 0 || parseInt(t.type.slice(1)) >= parseInt(arr[i-1].type.slice(1))
    );

    if (h1Count === 0) {
      score -= 15;
      recommendations.push("Add an H1 title tag");
    } else if (h1Count > 1) {
      score -= 10;
      recommendations.push("Use only one H1 tag per page");
    }

    if (!hasProperHeadingStructure) {
      score -= 5;
      recommendations.push("Maintain proper heading hierarchy (H1 → H2 → H3)");
    }

    analysis.headingStructure = `Found ${titles.length} headings, ${h1Count} H1 tags`;
  }

  // Check content length
  const contentLength = paragraphs.join(' ').length;
  if (contentLength < 300) {
    score -= 20;
    recommendations.push("Increase content length (aim for at least 300 words)");
  }

  // Check meta description
  if (metadata && metadata.description) {
    const descLength = metadata.description.length;
    if (descLength < 120 || descLength > 160) {
      score -= 10;
      recommendations.push("Optimize meta description length (120-160 characters)");
    }
    analysis.metaDescription = `${descLength} characters`;
  } else {
    score -= 15;
    recommendations.push("Add a meta description");
  }

  // Check links
  if (links && links.length > 0) {
    const internalLinks = links.filter(l => l.type === 'internal');
    const externalLinks = links.filter(l => l.type === 'external');
    
    if (internalLinks.length < 2) {
      score -= 5;
      recommendations.push("Add more internal links");
    }
    
    if (externalLinks.length < 1) {
      score -= 5;
      recommendations.push("Consider adding relevant external links");
    }

    // Check for descriptive link text
    const nonDescriptiveLinks = links.filter(l => 
      /^(click here|read more|learn more|here)$/i.test(l.text.trim())
    );
    
    if (nonDescriptiveLinks.length > 0) {
      score -= 5;
      recommendations.push("Use more descriptive link text instead of generic phrases");
    }
  } else {
    score -= 10;
    recommendations.push("Add relevant internal and external links");
  }

  return {
    score: Math.max(0, score),
    analysis,
    recommendations
  };
}

module.exports = analyzeSEO;
