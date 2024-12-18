export const mockAnalysis = {
  structure: {
    header: {
      type: 'header',
      children: [
        {
          type: 'nav',
          className: 'navbar',
          children: [
            {
              type: 'div',
              className: 'logo',
              text: 'Example Site'
            },
            {
              type: 'ul',
              className: 'nav-links',
              children: [
                { type: 'li', text: 'Home' },
                { type: 'li', text: 'About' },
                { type: 'li', text: 'Contact' }
              ]
            }
          ]
        }
      ]
    },
    main: {
      type: 'main',
      children: [
        {
          type: 'section',
          className: 'hero',
          children: [
            {
              type: 'h1',
              text: 'Welcome to our site'
            },
            {
              type: 'p',
              text: 'This is a beautiful hero section with engaging content.'
            }
          ]
        },
        {
          type: 'section',
          className: 'features',
          children: [
            {
              type: 'div',
              className: 'feature-card',
              children: [
                { type: 'h3', text: 'Feature 1' },
                { type: 'p', text: 'Amazing feature description' }
              ]
            }
          ]
        }
      ]
    }
  },
  components: `const Header = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">Example Site</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
};

const Main = () => {
  return (
    <main>
      <section className="hero">
        <h1>Welcome to our site</h1>
        <p>This is a beautiful hero section with engaging content.</p>
      </section>
      <section className="features">
        <div className="feature-card">
          <h3>Feature 1</h3>
          <p>Amazing feature description</p>
        </div>
      </section>
    </main>
  );
};`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example Site</title>
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="logo">Example Site</div>
            <ul class="nav-links">
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="hero">
            <h1>Welcome to our site</h1>
            <p>This is a beautiful hero section with engaging content.</p>
        </section>
        <section class="features">
            <div class="feature-card">
                <h3>Feature 1</h3>
                <p>Amazing feature description</p>
            </div>
        </section>
    </main>
</body>
</html>`
};
