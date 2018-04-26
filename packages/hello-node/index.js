const http = require('http');
let config;

try {
  config = require(process.argv[2]);
}
catch(e) {
  config = {
    host: '0.0.0.0',
    port: 3000
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let body;

  if (req.url === '/health') {
    res.statusCode = config.status;

    body = {
      status: res.statusCode,
      message: config.message
    };
  }
  else {
    res.statusCode = 200;

    body = {
      interesting: 'data'
    };
  }

  res.end(JSON.stringify(body));
});

server.listen(config.port, config.host, () => {
  console.log(`hello-node is now running at http://${config.host}:${config.port}/`);
});
