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
        <title>Swedish Hiking Guide</title>
        ${createPageStyles()}
      </head>
      <body>
        <h1>Welcome to Swedish Hiking Guide</h1>
        ${createNavigationMenu()}
        <div class="content">
          <h2>Discover Sweden's Natural Beauty</h2>
          <p>Embark on an unforgettable journey through Sweden's stunning landscapes, from ancient forests to majestic mountains.</p>
          <p>Explore the best hiking trails, learn essential hiking techniques, and discover Sweden's unique outdoor culture with allemansrätten (right to roam).</p>
          <ul>
            <li><strong>Home & About:</strong> Your gateway to Swedish hiking adventures</li>
            <li><strong>Contact & Blog:</strong> Essential hiking guides and trail information</li>
            <li><strong>Blog:</strong> Comprehensive hiking how-tos, trail guides, and safety tips</li>
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
        <title>About - Swedish Hiking Guide</title>
        ${createPageStyles()}
      </head>
      <body>
        <h1>About Swedish Hiking Guide</h1>
        ${createNavigationMenu()}
        <div class="content">
          <h2>Your Complete Hiking Resource</h2>
          <p>Swedish Hiking Guide is your comprehensive resource for exploring Sweden's incredible wilderness and hiking culture:</p>
          <ul>
            <li>Detailed trail guides and hiking routes across Sweden</li>
            <li>Essential hiking how-tos and safety information</li>
            <li>Information about Sweden's unique allemansrätten (right to roam)</li>
            <li>Seasonal hiking tips and weather considerations</li>
            <li>Equipment recommendations and packing guides</li>
          </ul>
          <p>Whether you're a beginner or experienced hiker, discover the natural beauty that makes Sweden one of the world's premier hiking destinations.</p>
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
      queryInfo = `<div class="query-info"><strong>Hiking Topic:</strong> ${query.post}</div>`;

      const postFiles = {
        'gear': 'gear.html',
        'trails': 'trails.html',
        'safety': 'safety.html'
      };
      filename = `content/${postFiles[query.post] || 'blog.html'}`;
    }

    if (query.theme) {
      const themeInfo = `<div class="query-info"><strong>Guide Type:</strong> ${query.theme}</div>`;
      queryInfo = queryInfo + themeInfo;

      const themeFiles = {
        'howto': 'howto.html',
        'locations': 'locations.html'
      };
      filename = `content/${themeFiles[query.theme] || 'blog.html'}`;
    }

    if (query.post && query.theme) {

      if (query.post === 'gear' && query.theme === 'howto') {
        filename = 'content/gear.html';
      } else {
        filename = 'content/blog.html';
      }
    }

    res.end(createPageWithFileContent('Hiking Guide', filename, queryInfo));
  } else {
    res.statusCode = 404;
    res.end(`
      <html>
        <head>
          <title>404 - Trail Not Found</title>
          ${createPageStyles()}
        </head>
        <body>
          <h1>404 - Trail Not Found</h1>
          ${createNavigationMenu()}
          <div class="content">
            <p>The hiking trail you're looking for seems to have wandered off the beaten path.</p>
            <p><a href="/">Return to Base Camp</a></p>
          </div>
        </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});