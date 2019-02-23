/*
*
* Request  Front-end handlers 
*
*
*/

// Dependencies
const helpers = require('../lib/helpers');

const util = require('util');

// Debud the module
const debug = util.debuglog('handlers');



// Container handlers
// Define the handlers
const handlers = {};


// Index
handlers.index = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // prepare data for interpolation
        const templateData = {
            'head.title': 'Pizza shop',
            'head.description': 'this is the meta description',
            'body.title': 'Pizza shop',
            'body.class': 'index'

        };

        // Read in template as a string
        helpers.getTemplate('index', templateData, function (err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.univesalTemplates(str, templateData, function (err, str) {
                    if (!err) {
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }

                });


            } else {
                callback(500, undefined, 'html');
            }

        });

    } else {
        callback(405, undefined, 'html');
    }

};


// Account create
handlers.accountCreate = function (data, callback) {
    if (data.method == 'get') {
        // prepare data for interpolation
        const templateData = {
            'head.title': 'Account Create',
            'head.description': 'Create your account',
            'body.title': 'Account',
            'body.class': 'account-create'

        };

        // Read in template as a string
        helpers.getTemplate('accountCreate', templateData, function (err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.univesalTemplates(str, templateData, function (err, str) {
                    if (!err) {
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }

                });


            } else {
                callback(500, undefined, 'html');
            }

        });

    } else {
        callback(405, undefined, 'html');
    }

}



// Handlers Login - Session
handlers.sessionCreate = function (data, callback) {
    if (data.method == 'get') {
        // Prepare data of interpolation
        const templateData = {
            'head.title': 'Login',
            'head.description': 'Login',
            'body.title': 'Login',
            'body.class': 'login'

        };
        // Read in template as a string
        helpers.getTemplate('login', templateData, function (err, str) {
            if (!err && str) {
                // Add Universal header and footer
                helpers.univesalTemplates(str, templateData, function (err, str) {
                    if (!err) {
                        callback(200, str, 'html');

                    } else {
                        callback(500, undefined, 'html');
                    }

                });

            } else {

            }

        });

    };

};


// Handler Menu list

handlers.menuList = function (data, callback) {
    if (data.method == 'get') {
        // prepare data for interpolation
        const templateData = {
            'head.title': 'Account Create',
            'head.description': 'Create your account',
            'body.title': 'Account',
            'body.class': 'account-create'

        };

        // Read in template as a string
        helpers.getTemplate('menu', templateData, function (err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.univesalTemplates(str, templateData, function (err, str) {
                    if (!err) {
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }

                });


            } else {
                callback(500, undefined, 'html');
            }

        });

    } else {
        callback(405, undefined, 'html');
    }

};

// Products
handlers.cartCreate = function (data, callback) {
    if (data.method == 'get') {
        // Prepare data for interpolation
        const templateData = {

        };

        // verify if user has permission
        

        // Read template as string
        helpers.getTemplate('cart', templateData, function (err, str) {
            if (!err && str) {

                // Add the universal header and footer 
                helpers.univesalTemplates(str, templateData, function (err, str) {
                    if (!err) {
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html');
            }

        });




    } else {
        callback(405, undefined, 'html');
    }


};


// Checkout order
handlers.checkoutCreate = function (data, callback) {
    if (data.method == 'get') {
        // Prepare data for interpolation
        const templateData = {

        };

        // verify if user has permission
        

        // Read template as string
        helpers.getTemplate('checkout-order', templateData, function (err, str) {
            if (!err && str) {

                // Add the universal header and footer 
                helpers.univesalTemplates(str, templateData, function (err, str) {
                    if (!err) {
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html');
            }

        });




    } else {
        callback(405, undefined, 'html');
    }


};

// Static 

// Favicon
handlers.favicon = function (data, callback) {
    // Reject any request that ins't a Get
    if (data.method == 'get') {
        // Read in the favicon 's data
        helpers.getStaticAssets('favicon.icon', function (err, data) {
            if (!err && data) {
                callback(200, data, 'favicon');

            } else {
                callback(405);
            }

        });

    } else {
        callback(405);
    }
}

// Assets
handlers.public = function (data, callback) {
    // Reject any request that ins't a Get
    if (data.method == 'get') {
        // Get the filename being requested
        const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssetName.length > 0) {
            // Read in the asset's data
            helpers.getStaticAssets(trimmedAssetName, function (err, data) {
                if (!err && data) {
                    // Determine the content-type (default to plain-text)
                    let contentType = 'plain';
                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }
                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }
                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }
                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }
                    // Callback the data 
                    callback(200, data, contentType);

                } else {
                    callback(404);
                }

            });

        } else {
            callback(404);
        }



    } else {
        callback(405);
    }

};

// Export module
module.exports = handlers;
