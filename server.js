var express = require("express");
var os = require('os');
var acceptLanguage = require('accept-language');
var uaparser = require('ua-parser');
var app = express();

// show the index page
app.get('/', function (req, res) {
  res.send("Request Header Parser Microservice: [User Story] I can get the IP address, language and operating system for my browser.");
});

// show the api page
app.get('/whoami', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(scan(req)));
});

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 8080!');
});

// api function
function scan(req) {
    var result = {
        "ip" : scanIp(req),
        "language" : scanLanguage(req),
        "software" : scanOs(req)
    };
    return result;
}

function scanIp(req) {
    var ifaces = os.networkInterfaces();
    //console.log(JSON.stringify(ifaces, null, 4));
    for (var iface in ifaces) {
      var iface = ifaces[iface];
      for (var alias in iface) {
        var alias = iface[alias];
        //console.log(JSON.stringify(alias, null, 4));
        if ('IPv4' !== alias.family || alias.internal !== false) {
          // debug("skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses");
          continue;
        }
        //console.log("Found ipaddress: " + alias.address);
        return alias.address;
      }
    }
}

function scanLanguage(req) {
    //acceptLanguage.languages(['en-US', 'zh-CN']);
    return acceptLanguage.get(req.headers['accept-language']);
}

function scanOs(req) {
    var r = uaparser.parse(req.headers['user-agent']);
    return r.os.toString();
}