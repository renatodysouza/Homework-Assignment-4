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
const debug = util.debuglog('user');


// Base directory of the data folder
const baseDir = path.join(__dirname, '/../.data');


// container menu models
const cartModel = {};


// Math function with request method

cartModel.carts = function (data, callback) {
    const acceptableMethods = ['post', 'get', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        cartModel._carts[data.method](data, callback)

    } else {

        callback(405);

    };

}


cartModel._carts = {};


// Cart - Method Post
// Require data: menuId
// Optional data: none

cartModel._carts.post = function (data, callback) {
    // Check all required fields are filled out
    const menuId = typeof (data.payload.id) == 'string' ? data.payload.id : false;
    const qtd = typeof (data.payload.qtd) == 'string' ? data.payload.qtd : false;
console.log(menuId ,qtd  )
   
    // Vefify required fileds
    if (menuId && qtd) {
        
        // Verify if user is logout -(verify if token exist and is valid)
        vToken._tokens.get(data, function (status, dataToken) {
            console.log(dataToken)
            if (status == '200' && dataToken) {

                
                // Readding menu data
                _data.read('menus', menuId, function (err, menuData) {
                    if (!err) {
                       
                        // save new cart
                        _data.read('carts', dataToken.phone+'_cart', function (err, cart) {
                            if (!err) {

                             // Creating cart object
                            const date = new Date();
                            const priceT = cart.priceTotal;
                            const newOrderPrice = menuData.price * qtd;
                            const priceFn =  priceT + newOrderPrice;
                            
                            console.log(priceFn)

                            const cartObject = {
                                'order': dataToken.phone+'_cart',
                                'products': [menuData, cart],
                                'priceTotal': newOrderPrice + priceT,
                                'order delivered': false,
                                'created_at': Date.now(),
                                'updateOrder': date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                            };


   

                            // Save the cart object
                            _data.update('carts', dataToken.phone+'_cart', cartObject, function (err) {

                                if (!err) {

                                    callback(200, cartObject);

                                } else {

                                    callback(500, { 'Error': 'could not save the cart, cart already exist. Use get or put methods' });
                                }
                            });

                            } else {
                                  // Creating cart object
                            const date = new Date();
                        
                            const cartObject = {
                                'order': dataToken.phone+'_cart',
                                'products': [menuData, cart],
                                'priceTotal': menuData.price * qtd,
                                'order delivered': false,
                                'timeUpdadeOrder': date.toLocaleTimeString(),
                                'updateOrder': date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                            };
                            
                            
                            // Save the cart object
                            _data.create('carts', dataToken.phone+'_cart', cartObject, function (err) {
                                if (!err) {

                                    callback(200, cartObject);

                                } else {

                                    callback(500, { 'Error': 'could not save the cart, cart already exist. Use get or put methods' });
                                }
                            });

                            }
                        });

                    } else {
                        callback(400, { 'Error': 'please, Verify if product id is valid' });

                    }

                });

            } else {
                callback(400, dataToken);
            }
        });
    } else {
        callback(500, { 'Error': 'Missing required id products fields' });
    }
};


// Cart - Method Get
// Require data: none
// Optional data: none

cartModel._carts.get = function (data, callback) {

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


cartModel._carts.delete = function (data, callback) {
    // Check all required fields are filled out
    const menuId = typeof (data.payload.id) == 'string' && data.payload.id ? data.payload.id : false;
    
    if (menuId) {
        // Verify if user is logout -(verify if token exist and is valid)
        vToken._tokens.get(data, function (status, dataToken) {
            if (status == '200' && dataToken) {

                _data.delete('carts', dataToken.phone+'_cart', function(err, data) {
                    if(!err){

                        callback(200, {'msg': 'Cart deleted sucessfuly'});

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

module.exports = cartModel;
