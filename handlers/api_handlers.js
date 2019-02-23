/*
*
* Request  API handlers 
*
*
*/

// Dependencies

const util = require ('util');

// Debud the module
const debug = util.debuglog('handlers');


// Models
const userModel = require('../models/user');
const tokenMode = require('../models/token');
const menuModel = require('../models/menu');
const cartModel = require('../models/cart');
const checkoutModel = require('../models/checkout');
const orderModel = require('../models/order');


// Container handlers
// Define the handlers
const handlersApi = {};

// Model users
handlersApi.users = userModel.users;

// Model Token
handlersApi.tokens = tokenMode.tokens;

// Model Cart
handlersApi.cart = cartModel.carts;


// Model Menus
handlersApi.menus = menuModel.menus;


// Model Order
handlersApi.order = orderModel.order;

// Model Checkout
handlersApi.checkout = checkoutModel.checkout;

// Ping handler
handlersApi.ping = function (data, callback) {
    callback(200);
}

// Not found handlers
handlersApi.notFound = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(404);
}

// Export module
module.exports = handlersApi;