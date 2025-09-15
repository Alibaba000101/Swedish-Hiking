const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3080;

function sendHtml(res, html) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>404 Not Found</h1><p>Route not found.</p>');
}

function readFileSafe(filePath, contentType, res) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error reading file');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
    res.end(data);
  });
}

function renderHome() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>History of Programming</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f7fafc; color: #1a202c; }
        h1 { text-align: center; color: #2b6cb0; }
        nav { text-align: center; margin: 24px 0; }
        nav a { display: inline-block; margin: 0 10px; padding: 10px 16px; background: #ebf8ff; color: #2b6cb0; text-decoration: none; border-radius: 6px; border: 1px solid #bee3f8; }
        nav a:hover { background: #bee3f8; }
        .content { max-width: 800px; margin: 0 auto; line-height: 1.65; }
        code { background: #edf2f7; padding: 2px 6px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>History of Programming</h1>
      <nav>
        <a href="/early">Early Computing</a>
        <a href="/languages">Programming Languages</a>
        <a href="/pioneers">Pioneers</a>
        <a href="/modern">Modern Programming</a>
      </nav>
      <div class="content">
        <p>Explore how programming evolved: from early mechanical computation to modern software development.</p>
        <p>Try query routes:</p>
        <ul>
          <li><a href="/languages?name=python">/languages?name=python</a></li>
          <li><a href="/languages?name=javascript">/languages?name=javascript</a></li>
          <li><a href="/pioneers?person=ada">/pioneers?person=ada</a></li>
          <li><a href="/pioneers?person=hopper">/pioneers?person=hopper</a></li>
        </ul>
      </div>
    </body>
    </html>
  `;
}

function renderEarly() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Early Computing - History of Programming</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #fffaf0; color: #1a202c; }
        a { color: #2b6cb0; text-decoration: none; }
        h1 { text-align: center; color: #975a16; }
        .content { max-width: 800px; margin: 0 auto; line-height: 1.7; }
      </style>
    </head>
    <body>
      <a href="/">← Back to Home</a>
      <h1>Early Computing</h1>
      <div class="content">
        <p>From mechanical calculators to Turing's ideas and the first electronic computers, early computing laid the foundations of programming.</p>
      </div>
    </body>
    </html>
  `;
}

// Create HTTP server using only http, fs, and url
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || '/';
  const query = parsed.query || {};

  if (pathname === '/') {
    return sendHtml(res, renderHome());
  }

  if (pathname === '/early') {
    return sendHtml(res, renderEarly());
  }

  // Query-driven route: /languages?name=python|javascript|c|java
  if (pathname === '/languages') {
    const name = (query.name || '').toString().toLowerCase();
    if (!name) {
      return readFileSafe(__dirname + '/content/programming-languages.html', 'text/html', res);
    }
    const safeNames = ['python', 'javascript', 'c', 'java'];
    if (!safeNames.includes(name)) {
      return readFileSafe(__dirname + '/content/programming-languages.html', 'text/html', res);
    }
    return readFileSafe(__dirname + '/content/languages/' + name + '.html', 'text/html', res);
  }

  // Query-driven route: /pioneers?person=ada|turing|hopper|hamilton
  if (pathname === '/pioneers') {
    const person = (query.person || '').toString().toLowerCase();
    if (!person) {
      return readFileSafe(__dirname + '/content/pioneers.html', 'text/html', res);
    }
    const safePeople = ['ada', 'turing', 'hopper', 'hamilton'];
    if (!safePeople.includes(person)) {
      return readFileSafe(__dirname + '/content/pioneers.html', 'text/html', res);
    }
    return readFileSafe(__dirname + '/content/pioneers/' + person + '.html', 'text/html', res);
  }

  if (pathname === '/modern') {
    return readFileSafe(__dirname + '/content/modern-programming.html', 'text/html', res);
  }

  return sendNotFound(res);
});

server.listen(PORT, () => {
  console.log('Programming History HTTP server running on http://localhost:' + PORT);
});
