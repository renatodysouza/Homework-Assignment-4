/*
* Author: Renato souza
* Description: Pizza delivery Api
* Primary file for the api 
*/


// Dependencies
const server = require('./lib/server');
const works = require('./lib/workers');
const cli = require('./lib/cli');

// Declare the app
const app = {};

// Init function
app.init = function () {
    // Start the server
    server.init();

    // Start the workers
    works.init();

    // Start cli, but make shure it starts last
    setTimeout(() => {
        cli.init();
    }, 50);

};

// Execute function
app.init();

// Export the app
module.exports = app;
