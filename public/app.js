
/* 
*
*   Frontemd Logic for the application
*
*/


// Containe for the frontend application
const app = {};


// Config
app.config = {
    'sessionToken': false,
    'username': '',
};

// AJAX client (for the restful api)
app.client = {};


// Interface for making API calls
app.client.request = function (headers, path, method, queryStringObject, payload, callback) {


    // Set default 
    headers = typeof (headers) == 'object' && headers !== null ? headers : {};
    path = typeof (path) == 'string' ? path : '/';
    method = typeof (method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof (queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof (payload) == 'object' && payload !== null ? payload : {};
    callback = typeof (callback) == 'function' ? callback : false;

    // For each query string parameter sent, add it to the path
    let requestUrl = path + '?';
    let counter = 0;
    for (let queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++
            // If at list queryString parameter has already been add, prepend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';
            }
            // Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];

        }

    };
    // Form the http request as a json type
    const xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // For each header sent, add it to the requestc

    for (let headerKey in headers) {
        xhr.setRequestHeader(headerKey, headers[headerKey]);
    };




    // If  there is a current session token set, add that as a header
    if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        console.log(token);



        xhr.setRequestHeader("token", token.replace(/\"/g, ""));
    }

    // When the request comes back. handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            const statusCode = xhr.status;
            const responseReturned = xhr.responseText;
            // Callback if requested
            if (callback) {
                try {
                    const parseResponse = JSON.parse(responseReturned);
                    callback(statusCode, parseResponse);
                } catch (e) {
                    callback(statusCode, false);
                }
            }
        }
    };

    // Send the payload string
    const payloadString = JSON.stringify(payload);
    xhr.send(payloadString);


};


// Bind form cart checkout
app.bindFormCheckout = function () {

    if (document.getElementById('form-checkout')) {

        document.getElementById('form-checkout').addEventListener("submit", function (e) {
            // Stop it from submitting
            e.preventDefault();
            const formId = this.id;
            // Turn the inputs into a payload
            const payload = {};
            const elements = this.elements;
            const path = this.action;
            var limit = elements.length
            const method = this.method.toUpperCase();
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type !== 'submit') {

                    const valueOfElement = elements[i].value;
                    payload[elements[i].name] = valueOfElement;

                };
            }

            app.client.request(undefined, '/api/cart', 'get', undefined, undefined, function (statusCode, responsePayload) {
                // Display an error on the form if needed
                if (statusCode !== 200) {

                    console.log(responsePayload);

                } else {
                    // Adding order in payload
                    payload['order'] = responsePayload;

                    // Call the API
                    app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
                        // Display an error on the form if needed
                        if (statusCode !== 200) {
                            // Try to get the error from the api, or set a default error message
                            var error = typeof (responsePayload.error) == 'string' ? responsePayload.error : 'An error has occured, please try again';

                            // Set the formError field with the error text
                            document.querySelector("#" + formId + " .formError").innerHTML = error;

                            // Show (unhide) the form error field on the form
                            document.querySelector("#" + formId + " .formError").style.display = 'block';

                        } else {
                            // If successful, send to form response processor
                            app.formResponseProcessor(formId, payload, responsePayload);
                        }
                    });

                }

            });

        });
    }

}


// Bind form cart checkout
app.bindFormPayment = function () {

    if (document.getElementById('payment-form')) {

        document.getElementById('payment-form').addEventListener("submit", function (e) {
            // Stop it from submitting
            e.preventDefault();
            const formId = this.id;
            // Turn the inputs into a payload
            const payload = {};
            const elements = this.elements;
            const path = this.action;
            var limit = elements.length
            const method = this.method.toUpperCase();
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type !== 'submit') {

                    const valueOfElement = elements[i].value;
                    payload[elements[i].name] = valueOfElement;

                };
            }
            // Call the API
            app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
                // Display an error on the form if needed
                if (statusCode !== 200) {
                    // Try to get the error from the api, or set a default error message
                    var error = typeof (responsePayload.error) == 'string' ? responsePayload.error : 'An error has occured, please try again';

                    // Set the formError field with the error text
                    document.querySelector("#" + formId + " .formError-pay").innerHTML = error;

                    // Show (unhide) the form error field on the form
                    document.querySelector("#" + formId + " .formError-pay").style.display = 'block';

                } else {
                    // If successful, send to form response processor
                    app.formResponseProcessor(formId, payload, responsePayload);
                }
            });
        });
    }

}


// Bind the form
// Form create user
app.bindFormsCreateUser = function () {

    if (document.getElementById("accountCreate")) {

        document.getElementById("accountCreate").addEventListener("submit", function (e) {
            // Stop it from submitting
            e.preventDefault();
            const formId = this.id;
            const path = this.action;
            const method = this.method.toUpperCase();

            // Hide the error message (if it's currently shown due to a previous error)
            document.querySelector("#" + formId + " .formError").style.display = 'hidden';

            // Turn the inputs into a payload

            const payload = {};
            const elements = this.elements;
            var count = 0;
            var limit = elements.length
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type !== 'submit') {
                    const valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
                    payload[elements[i].name] = valueOfElement;

                };

            }
            // Call the API
            app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
                // Display an error on the form if needed
                if (statusCode !== 200) {
                    // Try to get the error from the api, or set a default error message
                    var error = typeof (responsePayload.error) == 'string' ? responsePayload.error : 'An error has occured, please try again';

                    // Set the formError field with the error text
                    document.querySelector("#" + formId + " .formError").innerHTML = error;

                    // Show (unhide) the form error field on the form
                    document.querySelector("#" + formId + " .formError").style.display = 'block';

                } else {
                    // If successful, send to form response processor
                    app.formResponseProcessor(formId, payload, responsePayload);
                }
            });

        });

    }


};


// Create session 
app.createSession = function () {

    if (document.getElementById('login_create')) {
        document.getElementById('login_create').addEventListener("submit", function (e) {
            // Stop it from submitting
            e.preventDefault();
            const formId = this.id;
            const path = this.action;
            const method = this.method.toUpperCase();

            // Hide the error message (if it's currently shown due to a previous error)
            document.querySelector("#" + formId + " .formError").style.display = 'hidden';

            // Turn the inputs into a payload

            const payload = {};
            const elements = this.elements;
            var count = 0;
            var limit = elements.length

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type !== 'submit') {

                    payload[elements[i].name] = elements[i].value;

                };

            }

            // Call the API
            app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
                // Display an error on the form if needed
                if (statusCode !== 200) {
                    // Try to get the error from the api, or set a default error message
                    var error = typeof (responsePayload.error) == 'string' ? responsePayload.error : 'An error has occured, please try again';

                    // Set the formError field with the error text
                    document.querySelector("#" + formId + " .formError").innerHTML = error;

                    // Show (unhide) the form error field on the form
                    document.querySelector("#" + formId + " .formError").style.display = 'block';

                } else {
                    // If successful, send to form response processor
                    app.formResponseProcessor(formId, payload, responsePayload);
                }
            });

        });

    }





};

// Delete Session
app.deleteSession = function () {
    if (document.getElementById('delete-session')) {

        document.getElementById('delete-session').addEventListener('click', function (e) {
            e.preventDefault();

            const token = window.localStorage.removeItem('token');

            app.setLoggedInClass(false);       
        });


    }
}


// Bind cart information
// Set user cart
app.setCartData = function (payload) {
    // Call the api
    app.client.request(undefined, '/api/cart', 'POST', undefined, payload, function (statusCode, responsePayload) {
        if (statusCode !== 200) {
           

        } else {

            window.location.href = '/cart';

        }
    });

}

//  Get user cart data
app.getCartData = function () {
    if (document.getElementById('table-carts')) {
        // Call the API
        app.client.request(undefined, '/api/cart', 'get', undefined, undefined, function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode !== 200) {
                console.log('Doesnt exist any cart');

            } else {

                const cartView =
                    `<div id="order-cart"><h2 id="order">Order</h2>
            <p>${responsePayload.order}</p>
            </div>
            <div id="products-cart">
            <h3>Produts</h3>
             <p>${responsePayload.products[0].product}</p>
            <p>${responsePayload.products[0].description}</p>
            </div>
            <div id="total-price"><h4>Total</h4>
            <p>${responsePayload.priceTotal}</p>
            </div>`;


                document.getElementById('table-carts').innerHTML = cartView;

                // If successful, send to form response processor
                return responsePayload;
            }
        });

    }


}



// Set or remove the loggedin class from the body
app.setLoggedInClass = function (add) {
    var targetCart = document.getElementById('cart-menu');
    var targetLogout = document.getElementById('delete-session');
    var targetSignup = document.getElementById('signup');
    var targetLogin = document.getElementById('login');
    var targetAdminMenu = document.getElementById('admin-menu');
    var targetWelcome_Msg = document.getElementById('welcome');



    if (add) {
        targetAdminMenu.style.display = 'none';
        targetCart.style.display = 'block';
        targetCart.style.display = 'block';
        targetLogin.style.display = 'none';
        targetSignup.style.display = 'none';
        targetWelcome_Msg.innerHTML = '<h4>Olá User</h3>';
        targetLogout.style.display = 'block';

    } else {
        targetAdminMenu.style.display = 'none';
        targetLogin.style.display = 'block';
        targetLogout.style.display = 'none';
        targetSignup.style.display = 'block';


    }





};

// Set the session token in the app.config object as well  as localstorage
app.setSessionToken = function (token) {

    if (token) {


        localStorage.setItem('token', token);
        app.setLoggedInClass(true);
        app.resetToken();


    } else {
        app.config.sessionToken = false;
    }


};

// Reset token 
app.resetToken = function () {

    setInterval(() => {

        localStorage.removeItem('token');
        app.renewToken(function (token) {

        });
        localStorage.removeItem('token');


    }, 1000 * 60 * 60);

}

// Renew the token 
app.renewToken = function (callback) {
    const currentToken = typeof (app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    if (currentToken) {
        // Update the token with a new expiration
        const payload = {
            'id': currentToken.id,
            'extend': true
        }
        app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode == 200) {
                // Get the new token details
                var queryStringObject = { 'id': currentToken.id };
                app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
                    // Display an error on the form if needed
                    if (statusCode == 200) {
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            }
        });
    } else {
        app.setSessionToken(false);
        callback(true);
    }


};


// Form response processor
app.formResponseProcessor = function (formId, payload, responsePayload) {
    var functionToCall = false;
    console.log(formId)
    if (formId == 'accountCreate') {
        // the account has been created successfully
        //Alert sucessfully create user 
        alert('Your account was create with sucess.');
        // Redirec to home url
        window.location.href = '/session/create';


    }
    if (formId == 'payment-form') {
        // Hide form payment
        document.getElementById('panel').style.display = 'none';
        // Hide form order
        document.getElementById('form-checkout').style.display = 'none';

        // Show mensage
        document.getElementById('msg-payment').innerHTML = `<p>Payment sucessfully. Your was send for email.</p>`;

        setTimeout(() => {
            window.location.href = '/';
        }, 5900);

    }
    if (formId == 'login_create') {
        // Set token in local storage

        app.setSessionToken(responsePayload.tokenId);


        // Redirec to home url
        window.location.href = '/';

    }

    if (formId == 'form-checkout') {

        // Show form payment
        document.getElementById('panel').style.display = 'block';
        // Hidde form order
        document.getElementById('form-checkout').style.display = 'none';

    }
    if (formId == 'delete-session') {
        // Delete token in local storage 
        localStorage.setItem('token', false);



        // Redirec to home url
        window.location.href = '/';


    }
};


app.btnCart = function () {
    if (document.getElementsByClassName('btn-small')) {
        const target = document.getElementsByClassName('btn-small');
        const length = target.length;
        for (let i = 0; i < length; i++) {

            target[i].addEventListener('click', function (e) {
                // Verify if user is logged
                const token = window.localStorage.getItem('token');
                console.log(token)
                if (token !== null) {
                    app.productClicked(e.target);

                    // Open modal

                    document.getElementById('modal1').className += ' modal-opened'
                    

                } else {
                    // Redirect from login
                    window.location.href = '/login';
                }
            })
        }
    };

};

// Pass data of the product clicked
app.productClicked = function (productInfo) {
    if (document.getElementById('pizza-name')) {
        const idTarget = productInfo.id;
        const nameProd = productInfo.name.toUpperCase();
        app.preparedPayloadToCart(idTarget, nameProd);

    }


}


// Close modal 
app.closeModal = function () {
    if (document.getElementById('close-modal')) {
        document.getElementById('close-modal').addEventListener('click', function () {
            document.getElementById('modal1').className = 'modal';
        });
    }
};


// Get all products
app.getProduct = function () {

    // Call the api
    app.client.request(undefined, '/api/menus', 'get', undefined, undefined, function (statusCode, responsePayload) {
        if (statusCode !== 200) {

        } else {

            try {

                app.productsView(responsePayload, function () {



                });


            } catch (error) {

            }


        }

    });

};


// Generate product in thwe view
app.productsView = function (payload, callback) {
    for (let menu of payload) {
        // Print products in the index
        let tewmp = document.querySelector('#products').innerHTML += `
            
        <div class="col s6 nproduct">
        <a href=""> <img class="responsive-img" src="public/img/pizza.jpeg">
            <div class="fig-prod" id=${menu.id}>
                <figcaption class="fig-prod-text">${menu.product} <span>${menu.price} €</span></figcaption>
                <a id='${menu.id}' name='${menu.product}' data-target="modal1"  class="waves-effect waves-light btn-small modal-trigger">Order Now</a>
           </div>

        </a>
       
       </div>`
        app.btnCart();
        callback(true);
    };

};

// Verify if user is logged
app.verifyLoginStatus = function () {
    if (localStorage.getItem('token')) {
        app.setLoggedInClass(true);
    } else {
        app.setLoggedInClass(false);

    }

};

// Create payload with received data from modal
app.preparedPayloadToCart = function (id, valueQtd) {

    // Get event click in the botton add in my cart
    document.getElementById('btn-add-my-cart').addEventListener('click', function () {
        const qtd = document.getElementById('qtd').value;
        const idStringfy = id.toString();
        const cartPayload = {
            'id': `${idStringfy}`,
            'qtd': qtd
        }
        app.setCartData(cartPayload);

    });



}


// Init (bootstrapping)
app.init = function () {
    // Bind all create user form submissions
    app.bindFormsCreateUser();
    app.bindFormCheckout();
    app.createSession();
    app.deleteSession();
    app.closeModal();
    app.getProduct();
    app.resetToken();
    app.verifyLoginStatus();
    app.getCartData();
    app.bindFormPayment();
    app.verifyLoginStatus();




};

// Call the init processes after the window loads
window.onload = function () {
    app.init();
};