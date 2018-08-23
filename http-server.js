const http = require('http');

const server = http.createServer((req, res) => {
 res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//    res.setHeader("X-Powered-By",' 3.2.1')
 //   res.setHeader("Content-Type", "application/json;charset=utf-8");

  res.end('IS OK');
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
