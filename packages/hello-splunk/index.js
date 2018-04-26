const https = require('https');
const http = require('http');
let config;

try {
  config = require(process.argv[2]);
}
catch(e) {
  config = {
    host: '0.0.0.0',
    port: 8888,
    splunk: {}
  }
}

['host', 'port', 'path', 'token', 'sourcetype'].forEach(key => {
  if (!config.splunk[key]) {
    console.error(`Missing configuration value for key splunk.${key}.`);
    process.exit(1);
  }
});

const server = http.createServer((req, res) => {

  if (req.method === 'POST' || req.headers['Content-Type'] !== 'application/json') {
    let health = '';

    req.on('data', d => {
      health += d.toString();
    });

    req.on('end', () => {
      let parsed;

      try {
        parsed = JSON.parse(health);
      }
      catch(e) {
        console.error(`Failed to parse posted data: ${health}`, e.message);
        return;
      }

      let body = JSON.stringify(
        {
          sourcetype: config.splunk.sourcetype,
          event: parsed
        }
      );

      var opts = {
        rejectUnauthorized: false,
        hostname: config.splunk.host,
        port: config.splunk.port,
        path: config.splunk.path,
        method: 'POST',
        headers: {
          'Authorization': `Splunk ${config.splunk.token}`,
          'Content-Type': 'application/json',
          'Content-Length': body.length,
        }
      };

      const splunkReq = https.request(opts, splunkRes => {
        const { statusCode } = splunkRes;
        let splunkBody = '';

        splunkRes.on('data', d => {
          splunkBody += d;
        });

        splunkRes.on('end', e => {
          if (statusCode >= 300) {
            console.error(`Unexpected HTTP response from the Splunk service: ${statusCode}. The response body was ${splunkBody}.`)
          }
        });
      });

      splunkReq.on('error', e => {
        console.error('Error communicating with the Splunk service: ', e.message);
      });

      splunkReq.write(body);
      splunkReq.end();

      res.writeHead(200);
      res.end();
    });
  }
  else {
    console.error('This service supports only HTTP POST requests of Content-Type application/json.');
  }
});

server.listen(config.port, config.host, () => {
  console.log(`hello-splunk is now running at http://${config.host}:${config.port}/`);
});
