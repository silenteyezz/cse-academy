/**
 * Asin's CSE Academic Portal - Backend Server (server.js)
 * 
 * Technology: Native Node.js (Zero external dependencies)
 * Features:
 *  - Serves the 3 main portal pages: Welcome (index.html), Roadmap (roadmap.html), and Quiz (quiz.html)
 *  - REST API endpoint POST /api/quiz-score (records assessment marks to quiz_scores.json)
 *  - REST API endpoint GET /api/quiz-scores (retrieves quiz history)
 *  - REST API endpoint POST /api/contact & GET /api/messages (inquiry logging)
 *  - REST API endpoint GET /api/health (server health status)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');
const QUIZ_SCORES_FILE = path.join(__dirname, 'quiz_scores.json');

// Ensure data files exist
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf8');
}
if (!fs.existsSync(QUIZ_SCORES_FILE)) {
  fs.writeFileSync(QUIZ_SCORES_FILE, JSON.stringify([], null, 2), 'utf8');
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --------------------------------------------------------------------------
  // API Route: POST /api/quiz-score
  // Records quiz completion marks in quiz_scores.json
  // --------------------------------------------------------------------------
  if (pathname === '/api/quiz-score' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { score, total, percentage, status } = data;

        const record = {
          id: 'score_' + Date.now(),
          timestamp: new Date().toISOString(),
          score: Number(score),
          total: Number(total),
          percentage: Number(percentage),
          status: String(status || 'Completed')
        };

        let scores = [];
        try {
          scores = JSON.parse(fs.readFileSync(QUIZ_SCORES_FILE, 'utf8'));
          if (!Array.isArray(scores)) scores = [];
        } catch {
          scores = [];
        }

        scores.push(record);
        fs.writeFileSync(QUIZ_SCORES_FILE, JSON.stringify(scores, null, 2), 'utf8');

        console.log(`[Quiz API] Recorded score: ${record.score}/${record.total} (${record.percentage}%) at ${record.timestamp}`);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, record: record }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid quiz score data' }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // API Route: GET /api/quiz-scores
  // --------------------------------------------------------------------------
  if (pathname === '/api/quiz-scores' && method === 'GET') {
    try {
      const data = fs.readFileSync(QUIZ_SCORES_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('[]');
    }
    return;
  }

  // --------------------------------------------------------------------------
  // API Route: POST /api/contact
  // --------------------------------------------------------------------------
  if (pathname === '/api/contact' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const newMessage = {
          id: 'msg_' + Date.now(),
          receivedAt: new Date().toISOString(),
          name: (data.name || '').trim(),
          email: (data.email || '').trim(),
          subject: (data.subject || '').trim(),
          message: (data.message || '').trim()
        };

        let messages = [];
        try {
          messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
          if (!Array.isArray(messages)) messages = [];
        } catch {
          messages = [];
        }

        messages.push(newMessage);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Message stored successfully' }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid format' }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // API Route: GET /api/health
  // --------------------------------------------------------------------------
  if (pathname === '/api/health' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      portal: "Asin's CSE Academic Hub",
      pages: ['Welcome (index.html)', 'Roadmap (roadmap.html)', 'Interactive Quiz (quiz.html)'],
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // --------------------------------------------------------------------------
  // Static File Serving with Friendly URLs
  // --------------------------------------------------------------------------
  if (method === 'GET' || method === 'HEAD') {
    let safePath = pathname;
    if (safePath === '/' || safePath === '') safePath = '/index.html';
    else if (safePath === '/roadmap') safePath = '/roadmap.html';
    else if (safePath === '/quiz') safePath = '/quiz.html';

    const normalizedPath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, normalizedPath);

    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head><meta charset="utf-8"><title>404 Not Found</title></head>
          <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
            <h1>404 - Page Not Found</h1>
            <p>The requested page <code>${pathname}</code> was not found on Asin's portal.</p>
            <p><a href="/">Return to Welcome Page</a></p>
          </body>
          </html>
        `);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size
      });

      if (method === 'HEAD') {
        res.end();
        return;
      }

      fs.createReadStream(filePath).pipe(res);
    });

    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('405 Method Not Allowed');
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Asin's CSE Academic Portal Server is active!`);
  console.log(`🌐 1. Welcome Page:   http://localhost:${PORT}`);
  console.log(`🗺️ 2. Roadmap Page:   http://localhost:${PORT}/roadmap.html`);
  console.log(`🧠 3. CS Quiz Page:   http://localhost:${PORT}/quiz.html`);
  console.log(`=======================================================`);
});
