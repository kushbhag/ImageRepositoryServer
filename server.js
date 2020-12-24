const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
console.log(`Running on ${port}`);

const server = http.createServer(app);

server.listen(port);