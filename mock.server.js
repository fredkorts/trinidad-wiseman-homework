import http from 'http';

const port = process.env.PORT || 8888;
const article = { id: 1, title: 'Hello World', body: 'This is a demo article.' };
const table = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  value: Math.floor(Math.random() * 100),
  category: ['A', 'B', 'C'][i % 3],
}));

http.createServer((req, res) => {
  if (req.url?.startsWith('/api/article')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(article));
    return;
  }
  if (req.url?.startsWith('/api/table')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(table));
    return;
  }
  res.writeHead(404);
  res.end('Not found');
}).listen(port, () => console.log(`Mock API at http://localhost:${port}`));
