"""
Asin's CSE Academic Portal - Python Alternative Backend (server.py)

Technology: Python 3 Standard Library (Zero dependencies)
Features:
  - Serves the 3 main pages: Welcome (index.html), Roadmap (roadmap.html), and Quiz (quiz.html)
  - REST API endpoint POST /api/quiz-score (stores assessment marks in quiz_scores.json)
  - REST API endpoint GET /api/quiz-scores
  - REST API endpoint GET /api/health
"""

import http.server
import socketserver
import json
import os
from datetime import datetime

PORT = 3000
DATA_FILE = os.path.join(os.path.dirname(__file__), 'messages.json')
QUIZ_FILE = os.path.join(os.path.dirname(__file__), 'quiz_scores.json')

for fpath in [DATA_FILE, QUIZ_FILE]:
    if not os.path.exists(fpath):
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump([], f, indent=2)

class PortalHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        # Friendly route shortcuts for the 3 main pages
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        elif self.path == '/roadmap':
            self.path = '/roadmap.html'
        elif self.path == '/quiz':
            self.path = '/quiz.html'

        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            res = {
                "status": "online",
                "portal": "Asin's CSE Academic Portal (Python Backend)",
                "pages": ["Welcome (index.html)", "Roadmap (roadmap.html)", "Quiz (quiz.html)"],
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
            self.wfile.write(json.dumps(res).encode('utf-8'))
            return

        if self.path == '/api/quiz-scores':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                with open(QUIZ_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            except Exception:
                self.wfile.write(b'[]')
            return

        super().do_GET()

    def do_POST(self):
        if self.path == '/api/quiz-score':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8')
            try:
                data = json.loads(body)
                record = {
                    "id": f"score_{int(datetime.now().timestamp() * 1000)}",
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "score": int(data.get("score", 0)),
                    "total": int(data.get("total", 10)),
                    "percentage": int(data.get("percentage", 0)),
                    "status": str(data.get("status", "Completed"))
                }
                scores = []
                if os.path.exists(QUIZ_FILE):
                    try:
                        with open(QUIZ_FILE, 'r', encoding='utf-8') as f:
                            scores = json.load(f)
                            if not isinstance(scores, list): scores = []
                    except Exception:
                        scores = []
                scores.append(record)
                with open(QUIZ_FILE, 'w', encoding='utf-8') as f:
                    json.dump(scores, f, indent=2)

                print(f"[Python API] Saved quiz score: {record['score']}/{record['total']} ({record['percentage']}%)")
                self.send_response(201)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "record": record}).encode('utf-8'))
            except Exception as err:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(err)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), PortalHandler) as httpd:
        print(f"=======================================================")
        print(f"🚀 Asin's CSE Academic Portal running with Python!")
        print(f"🌐 1. Welcome Page:   http://localhost:{PORT}")
        print(f"🗺️ 2. Roadmap Page:   http://localhost:{PORT}/roadmap.html")
        print(f"🧠 3. CS Quiz Page:   http://localhost:{PORT}/quiz.html")
        print(f"=======================================================")
        httpd.serve_forever()
