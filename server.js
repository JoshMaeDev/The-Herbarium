const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const TREFFLE_API_KEY = process.env.TREFFLE_API_KEY || 'usr-GBy7mDD-VBdSHfmVcGx_eKPhfI6uv7_GZJoaJJZ93so';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function fetchFromTreffle(url) {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Treffle API request failed (${response.status}): ${text}`);
  }

  return response.json();
}

async function handleApi(req, res, url) {
  const pathname = url.pathname;

  if (pathname === '/api/plants/search') {
    const q = url.searchParams.get('q') || '';
    const limit = url.searchParams.get('limit') || '6';

    if (!q.trim()) {
      return sendJson(res, 400, { error: 'Missing q query parameter' });
    }

    try {
      const target = `https://trefle.io/api/v1/plants/search?q=${encodeURIComponent(q.trim())}&limit=${encodeURIComponent(limit)}&token=${encodeURIComponent(TREFFLE_API_KEY)}`;
      const data = await fetchFromTreffle(target);
      return sendJson(res, 200, data);
    } catch (error) {
      console.error('Treffle search error:', error.message);
      return sendJson(res, 500, { error: 'Failed to fetch plant search results' });
    }
  }

  const plantMatch = pathname.match(/^\/api\/plants\/(.+)$/);
  if (plantMatch) {
    const plantId = decodeURIComponent(plantMatch[1]);

    try {
      const target = `https://trefle.io/api/v1/plants/${encodeURIComponent(plantId)}?token=${encodeURIComponent(TREFFLE_API_KEY)}`;
      const data = await fetchFromTreffle(target);
      return sendJson(res, 200, data);
    } catch (error) {
      console.error('Treffle plant detail error:', error.message);
      return sendJson(res, 500, { error: 'Failed to fetch plant details' });
    }
  }

  return sendJson(res, 404, { error: 'API endpoint not found' });
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith('/api/')) {
    await handleApi(req, res, url);
    return;
  }

  let requestedPath = url.pathname === '/' ? '/herbarium-homepage (2).html' : url.pathname;
  requestedPath = requestedPath.replace(/^\/+/, '');

  const safePath = path.normalize(requestedPath);
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallback = path.join(PUBLIC_DIR, 'herbarium-homepage (2).html');
      serveStaticFile(res, fallback);
      return;
    }

    serveStaticFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`The Herbarium server is running at http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/plants/search and /api/plants/:id`);
});
