/* 
*
* Server related tasks
*
*/

// Dependencies

const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const helpers = require('./helpers');
const path = require('path');
const router = require('../routers/router');
const handlersApi = require('../handlers/api_handlers');
const handlers = require('../handlers/front_and_handlers');

// Debuging module
const util = require('util');
const debug = util.debuglog('server');


// Instantiate the server module object
const server = {};



// Server respost instantiate the http
server.Http = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});



// Server instatiate the https server
// ssl certificate
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

server.Https = https.createServer(server.httpsServerOptions, function () {
    server.unifiedServer(req, res);

});



// All the server logic for both the http and https server
server.unifiedServer = function (req, res) {
    // Get url and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');


    // Get query string as an object
    const queryString = parsedUrl.query;

    // Get http method
    const method = req.method.toLowerCase();

    // Get header as an object
    const headers = req.headers;

    // Get payload, if any
    const decoder = new stringDecoder('utf-8');
    var buffer = '';

    req.on('data', function (data) {
        buffer += decoder.write(data);

    });

    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handlers, if not found, use notFound handler
        let chooseHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlersApi.notFound;
        chooseHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chooseHandler;
        // If the request is within the public directory, use the public handler  insted

        // Constructing objects to send to the handler   
        const data = {
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        }

        // Route the request specified in the router

        chooseHandler(data, function (statusCode, payload, contentType) {

            // Determine of type of response (fallback to JSON)
            contentType = typeof(contentType) == 'string' ? contentType : 'json';


            // Use status code the handler, or default 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Return the reponse-parts that are content specific
            var payloadString = '';
            if(contentType == 'json') {
                res.setHeader('Content-Type', 'application/json');
                // Use payload code the handler, or default to empty object
                payload = typeof (payload) == 'object' ? payload : {};
                 // Convert payload to a string
                payloadString = JSON.stringify(payload);

            }
            if(contentType == 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof (payload) == 'string' ? payload : '';
              
            }
            if(contentType == 'favicon') {
                res.setHeader('Content-Type', 'imag/x-icon');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
              
            }
            if(contentType == 'css') {
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
              
            }
            if(contentType == 'png') {
                res.setHeader('Content-Type', 'imag/png');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
              
            }
            if(contentType == 'svg') {
                res.setHeader('Content-Type', 'imag/svg+xml');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
              
            }
            if(contentType == 'jpg') {
                res.setHeader('Content-Type', 'imag/jpg');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
              
            }
            if(contentType == 'plain') {
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
              
            }


            // Return the reponse-parts that are common to all content types
            res.writeHead(statusCode);
            res.end(payloadString);

        


            // if status code is different 200, show console.log
            if(statusCode !== 200) {
                debug('','Method: '+method.toUpperCase()+'\n'+' path: '+trimmedPath+'\n status code: '+statusCode);
            }
        });
 
    });
};

// Define a request router
server.router = router;
// Init server
server.init = function () {
    // Start http server

    server.Http.listen(config.httpPort, function () {
        // if 
        debug('The server is listening on port:', config.httpPort);

    });
    // Start  https server

    server.Https.listen(config.httpsPort, function () {
        debug('The server is listening on port:', config.httpsPort);

    });


};

// Export server
module.exports = server;