/* 
*
* Routers
*
*
 */

// Dependency
const handlersApi = require('../handlers/api_handlers');
const handlers = require('../handlers/front_and_handlers');




// Define a request router
const router = {
    // Router API
    'api/ping': handlersApi.ping,
    'api/users': handlersApi.users,
    'api/tokens': handlersApi.tokens,
    'api/menus': handlersApi.menus,
    'api/cart': handlersApi.cart,
    'api/order': handlersApi.order,
    'api/ckeckout': handlersApi.checkout,


    // Router Front-end
    '': handlers.index,  // Index

    // User Manager
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/delete': handlers.accountDelete,

    // Session Manager
    'login': handlers.sessionCreate,
    'session/delete': handlers.sessionDelete,

    // Menu Manager
    'menu': handlers.menuList,
    'menu/create': handlers.menuCreate,
    'menu/edit': handlers.menuEdit,
    'menu/delete': handlers.menuDelete,

    // Cart Manager
    'cart': handlers.cartCreate,
    'cart/edit': handlers.cartEdit,
    'cart/delete': handlers.cartDelete,

    // Checkout Manager
    'checkout/order': handlers.checkoutCreate,

    // Products 
    'product': handlers.products,

    // Static 
    'favicon.ico': handlers.favicon,
    'public': handlers.public














};




// Exports router
module.exports = router;