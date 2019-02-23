/* 
*
*Request CartModel - Cart
* 
*
*/



// Dependencies
const _data = require('../lib/data');
const helpers = require('../lib/helpers');
const path = require('path');
const util = require('util');
const vToken = require('./token');
const debug = util.debuglog('order');


// Base directory of the data folder
const baseDir = path.join(__dirname, '/../.data');


// container menu models
const orderModel = {};


// Math function with request method

orderModel.order = function (data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        orderModel._order[data.method](data, callback)

    } else {

        callback(405);

    };

}


orderModel._order = {};


// Cart - Method Post
// Require data:firstname, lastname, address, city, state, phone, email, order
// Optional data: none

orderModel._order.post = function (data, callback) {
    // Check all required fields are filled out
    const firstname = typeof (data.payload.firstname) == 'string' ? data.payload.firstname : false;
    const lastname = typeof (data.payload.lastname) == 'string' ? data.payload.lastname : false;
    const address = typeof (data.payload.address) == 'string' ? data.payload.address : false;
    const city = typeof (data.payload.city) == 'string' ? data.payload.city : false;
    const state = typeof (data.payload.state) == 'string' ? data.payload.state : false;
    const phone = typeof (data.payload.phone) == 'string' ? data.payload.phone : false;
    const email = typeof (data.payload.email) == 'string' ? data.payload.email : false;
    const order = typeof (data.payload.order) == 'object' ? data.payload.order : [];
1
    // Vefify required fileds
    if (firstname && lastname && address && city && state && phone && email && order) {

        // Verify if user is logout -(verify if token exist and is valid)
        vToken._tokens.get(data, function (status, dataToken) {

            if (status == '200' && dataToken) {

                // Create object order
                const orderObject = {
                    'firstname': firstname,
                    'lastname': lastname,
                    'address': address,
                    'city': city,
                    'state': state,
                    'phone': phone,
                    'email': email,
                    'order': order

                }
                // Save order
                _data.update('orders', dataToken.phone, orderObject, function(err, order) {

                    if(!err) {

                        callback(200, order);

                    } else {
                        
                        _data.create('orders', dataToken.phone, orderObject, function(err, order){

                            if(!err) {
                                callback(200, order);
                            }else {

                                callback(500, { 'Error': 'Could not create the order' });
                            }

                        });
                        
                        
                        
                        
                    }

                });


            } else {
                callback(400, dataToken);
            }
        });
    } else {
        callback(500, { 'Error': 'Missing required order fields' });
    }
};


// Cart - Method Get
// Require data: none
// Optional data: none

orderModel._order.get = function (data, callback) {

    vToken._tokens.get(data, function (status, dataToken) {
        if (status == '200' && dataToken) {

            // find cart by id
            _data.read('carts', dataToken.phone + '_cart', function (err, dataCart) {
                if (!err) {
                    callback(200, dataCart);

                } else {
                    callback(400, { 'Error': 'could find any cart for this user' });

                }
            });

        } else {
            callback(400, dataToken);
        }

    });

};


// Cart - Method Delete All
// Require data: Cart id
// Optional data: none


orderModel._order.delete = function (data, callback) {
    // Check all required fields are filled out
    const menuId = typeof (data.payload.id) == 'string' && data.payload.id ? data.payload.id : false;

    if (menuId) {
        // Verify if user is logout -(verify if token exist and is valid)
        vToken._tokens.get(data, function (status, dataToken) {
            if (status == '200' && dataToken) {

                _data.delete('carts', dataToken.phone + '_cart', function (err, data) {
                    if (!err) {

                        callback(200, { 'msg': 'Cart deleted sucessfuly' });

                    } else {

                        callback(400, { 'Error': 'Could not delete cart' });
                    }

                });


            } else {
                callback(400, { 'Error': 'Could not reading tokens' });
            }
        });



    } else {

    }

}
// export module

module.exports = orderModel;
