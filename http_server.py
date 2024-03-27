from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import os

class CustomRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加禁用缓存的响应头
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        # 添加允许跨域请求的响应头
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""

if __name__ == '__main__':
    os.chdir('/Users/andy.d.hu/demo/')  # 切换到包含 girl.glb 的目录
    server = ThreadedHTTPServer(('localhost', 8888), CustomRequestHandler)
    server.serve_forever()
