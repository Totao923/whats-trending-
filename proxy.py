#!/usr/bin/env python3
"""
Local proxy for Anthropic API — solves CORS for local dev.
Run with: python3 proxy.py
Listens on http://localhost:3001
"""
import http.server, urllib.request, urllib.error, json, os

API_KEY = open(os.path.join(os.path.dirname(__file__), 'research/.env')).read().strip().split('=')[1]

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress request logs

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body   = self.rfile.read(length)
        req    = urllib.request.Request(
            'https://api.anthropic.com/v1/messages',
            data=body,
            headers={
                'Content-Type':      'application/json',
                'x-api-key':         API_KEY,
                'anthropic-version': '2023-06-01'
            }
        )
        try:
            with urllib.request.urlopen(req) as r:
                data = r.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._cors()
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(data)

if __name__ == '__main__':
    server = http.server.HTTPServer(('localhost', 3001), ProxyHandler)
    print('Anthropic proxy running on http://localhost:3001')
    server.serve_forever()
