var fs = require('fs');
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// fs.writeFile('donuts.html', 'Whatever.', 'utf8', function(arg) {
//   console.log('writeFile has succeeded!', arg);
// });

// fs.readFile('donuts.html', 'utf8', function(err, data) {
//   console.log('readFile has succeeded!', data);
// });   

var serverData = {results: [{
  createdAt: '2016-08-15T23:51:47.674Z',
  objectId: 'qt43mO7IUZ',
  roomname: 'lobby',
  text: 'hola',
  updatedAt: '2016-08-15T23:51:47.674Z',
  username: 'dnf'
}]};

var requestHandler = function(request, response) {
  // console.log('request: ', request, 'response: ', response);
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json'; // 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);
  console.log('url', request.url);
  var fakeData = {'results': [{
    'roomname': 'Lobby', 
    'text': 'LOL IM HAVING FUN!', 
    'username': 'MrCool'
  }]};

  var stolenData = {
    'createdAt': '2016-08-15T23:51:47.674Z',
    'objectId': 'qt43mO7IUZ',
    'roomname': 'lobby',
    'text': 'hola',
    'updatedAt': '2016-08-15T23:51:47.674Z',
    'username': 'dnf'
  };
  var randoGen = function() {
    return Math.floor(Math.random() * 10000);
  };

  // handle request
  // if (request.url === '/') {
  //   var readPage = fs.createReadStream('./index.html');
  //   response.writeHead(200, {'Content-Type': 'text/html'});
  //   readPage.pipe(response);
  // }
  if (request.url === '/' && request.method === 'GET') {
    fs.exists('donuts.html', function(exists) {
      if (exists) {
        response.end('Donuts exists!!!!');
      } else {
        response.end('No donuts, my man.');
      }
    });
    headers['Content-Type'] = 'text/html';
    response.writeHead(200, headers);
    // fs.createReadStream('./chatterbox-client/client/index.html').pipe(response);
  } else if (request.url === '/classes/messages' && request.method === 'OPTIONS') {
    statusCode = 200;
    headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS';
    response.writeHead(statusCode, headers);
    response.end('OK', statusCode);

  } else if (request.url === '/classes/messages' && request.method === 'GET') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    // response.end(JSON.stringify(serverData), statusCode);
    var svData = fs.readFileSync('serverData.txt', 'utf8', function(err, data) {
      console.log('here is your sv data idiot: ', data);
    });  
    response.end(svData, statusCode);
    serverData = JSON.parse(svData);
  } else if (request.url === '/classes/messages' && request.method === 'POST') {
    var arr = '';
    request.on('data', function(data) { arr += data; });
    
    request.on('end', function(data) {
      var arrParsed = JSON.parse(arr);
      arrParsed.objectId = randoGen();
      serverData.results.unshift(arrParsed);
      
      var statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end("Thanks", statusCode);
      fs.writeFile('serverData.txt', JSON.stringify(serverData), 'utf8', function(arg) {
        console.log('writeFile has succeeded!', arg);
      });

    });
  } else {
    console.log(request.url);
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('Bad request', statusCode);
  }
  
  // // initial http server attempt
  // var readPage = fs.createReadStream('./index.html');
  // var server = http.createServer(function(request, response) {
  //   response.writeHead(200, {'Content-Type': 'text/html'});
  //   readPage.pipe(response);
  // }).listen(port, ip);



  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
