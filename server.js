const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3080;

function createPageStyles() {
  return `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
        color: #333;
        line-height: 1.6;
      }
      h1 {
        color: #2c3e50;
        text-align: center;
        margin-bottom: 30px;
      }
      nav {
        text-align: center;
        margin: 20px 0;
        padding: 20px 0;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      nav a {
        display: inline-block;
        margin: 0 15px;
        padding: 10px 20px;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
      }
      nav a:hover {
        background-color: #2980b9;
      }
      .content {
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .query-info {
        background-color: #e8f4fd;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        border-left: 4px solid #3498db;
      }
    </style>
  `;
}

function createNavigationMenu() {
  return `
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/blog">Blog</a>
    </nav>
  `;
}

function createHomePage() {
  return `
    <html>
      <head>
        <title>Harmonic Chronicles</title>
        ${createPageStyles()}
      </head>
      <body>
        <h1>Welcome to Harmonic Chronicles</h1>
        ${createNavigationMenu()}
        <div class="content">
          <h2>Musical Journey Awaits</h2>
          <p>Embark on an eloquent exploration of music's most captivating historical narratives.</p>
          <p>Navigate through the harmonious tapestry of musical evolution and discover the revolutionary moments that shaped our sonic landscape.</p>
          <ul>
            <li><strong>Home & About:</strong> Gateway to musical enlightenment</li>
            <li><strong>Contact & Blog:</strong> Curated chronicles from musical archives</li>
            <li><strong>Blog:</strong> Dynamic exploration of musical genres, eras, and revolutionary movements</li>
          </ul>
        </div>
      </body>
    </html>
  `;
}

function createAboutPage() {
  return `
    <html>
      <head>
        <title>About - Harmonic Chronicles</title>
        ${createPageStyles()}
      </head>
      <body>
        <h1>About Our Musical Archive</h1>
        ${createNavigationMenu()}
        <div class="content">
          <h2>The Symphonic Archive</h2>
          <p>Harmonic Chronicles represents a meticulously crafted digital sanctuary celebrating the profound evolution of musical artistry:</p>
          <ul>
            <li>Immersive narrative experiences (Home and About pages)</li>
            <li>Curated historical documentation (Contact and Blog archives)</li>
            <li>Dynamic exploration of musical movements and influential artists</li>
            <li>Harmonious design philosophy reflecting musical aesthetic principles</li>
          </ul>
          <p>Elegantly constructed with thoughtful programming, embodying the minimalist beauty of classical composition.</p>
        </div>
      </body>
    </html>
  `;
}

function loadContentFromFile(filename) {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (error) {
    return 'Content not found.';
  }
}

function createPageWithFileContent(title, filename, queryInfo = '') {
  const content = loadContentFromFile(filename);
  return `
    <html>
      <head>
        <title>${title} - Harmonic Chronicles</title>
        ${createPageStyles()}
      </head>
      <body>
        <h1>${title}</h1>
        ${createNavigationMenu()}
        ${queryInfo}
        <div class="content">
          ${content}
        </div>
      </body>
    </html>
  `;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.setHeader('Content-Type', 'text/html');

  if (pathname === '/') {
    res.end(createHomePage());
  } else if (pathname === '/about') {
    res.end(createAboutPage());
  } else if (pathname === '/contact') {
    res.end(createPageWithFileContent('Contact', 'content/contact.html'));
  } else if (pathname === '/blog') {
    let queryInfo = '';
    let filename = 'content/blog.html';

    if (query.post) {
      queryInfo = `<div class="query-info"><strong>Musical Post:</strong> ${query.post}</div>`;

      const postFiles = {
        'tech': 'ai.html',
        'web': 'digital.html',
        'nodejs': 'programming.html'
      };
      filename = `content/${postFiles[query.post] || 'blog.html'}`;
    }

    if (query.theme) {
      const themeInfo = `<div class="query-info"><strong>Musical Theme:</strong> ${query.theme}</div>`;
      queryInfo = queryInfo + themeInfo;
   
      const themeFiles = {
        'tutorial': 'education.html',
        'news': 'news.html'
      };
      filename = `content/${themeFiles[query.theme] || 'blog.html'}`;
    }

    if (query.post && query.theme) {
  
      if (query.post === 'tech' && query.theme === 'tutorial') {
        filename = 'content/ai.html';
      } else {
        filename = 'content/blog.html';
      }
    }

    res.end(createPageWithFileContent('Musical Chronicle', filename, queryInfo));
  } else {
    res.statusCode = 404;
    res.end(`
      <html>
        <head>
          <title>404 - Harmony Lost</title>
          ${createPageStyles()}
        </head>
        <body>
          <h1>404 - The Melody Escapes Us</h1>
          ${createNavigationMenu()}
          <div class="content">
            <p>The musical passage you seek has drifted beyond our orchestral reach.</p>
            <p><a href="/">Return to the Concert Hall</a></p>
          </div>
        </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});