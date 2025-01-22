import http from 'http';

const PORT = 5000;

const server = http.createServer((req, res) => res.end('Hello from server!'));

server.listen(PORT, () => {
  console.log(`Сервер запустился на порте ${PORT}`);
});
