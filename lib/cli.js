/*
*
*
* CLI-related-tasks
*
*
*/

// Dependencies
const readline = require('readline');
const _data = require('./data');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events { };
const e = new _events();


// Instanciate the cli module object 
const cli = {};


// Input handlers
e.on('man', function (str) {

    cli.responders.help();

});

e.on('help', function (str) {

    cli.responders.help();

});

e.on('allmenus', function (str) {

    cli.responders.allMenus();

});

e.on('allorder24', function (str) {

    cli.responders.allOrder24();

});

e.on('orderbyid', function (str) {

    cli.responders.oderById(str);

});

e.on('userbyemail', function (str) {

    cli.responders.userByEmail(str);

});

e.on('signup24h', function (str) {

    cli.responders.signup24h();

});
e.on('exit', function (str) {

    cli.responders.exit();

});


// Responders Object
cli.responders = {};

// Cli Helper / man
cli.responders.help = function () {

    const commands = {
        'exit': 'Exit of the CLI',
        'man': 'Show this help page',
        'help': 'Show this help',
        'allMenus': 'View all the current menu items',
        'allorder24h': 'View all the recent orders in the system (orders placed in the last 24 hours)',
        'oderById': 'Lookup the details of a specific order by order ID',
        'signup24h': 'View all the users who have signed up in the last 24 hours',
        'userByEmail': 'Lookup the details of a specific user by email address',

    }

    // Show header with wide screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // show wich command with explanation
    for (let key in commands) {

        if (commands.hasOwnProperty(key)) {

            let value = commands[key];
            let line = '\x1b[33m ' + key + '      \x1b[0m';
            let padding = 60 - line.length;

            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);

            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);

    cli.horizontalLine();

}

// Show all menus
cli.responders.allMenus = function (str) {

    // Read all menus
    _data.list('menus', function (err, menus) {

        if (!err && menus.length > 0) {

            const nMenus = menus.length;

            // Show number of the menus
            console.log(`You have ${nMenus} Menus`);

            menus.forEach(menus => {

                _data.read('menus', menus, function (err, menu) {

                    console.log(`Menu: ${menu.product}, Description: ${menu.description}, Quantity: ${menu.quantity},
                    Stock: ${menu.stock}, DataCreated: ${menu.dataCreated}, id: ${menu.id}, Price:  ${menu.price}`);

                });

            });



        } else {

            console.log('Could not find any menu to show');

        }


    });


}

// Show all orders in 24 hours
cli.responders.allOrder24 = function (str) {

    _data.list('orders', function (err, orders) {


        for (let order of orders) {

            _data.read('orders', order, function (err, ord) {


                const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

                const orderDate = ord.creatDate;

                if (orderDate > yesterday.getTime()) {

                    console.log(ord)
                }
            });
        }

    });



}

cli.responders.oderById = function (str) {
    // Cut the '--' 
    const strArray = str.split('--');
    // Get the params
    const idOrder = strArray[1];

    _data.read('orders', idOrder, function (err, order) {

        if (!err && order) {

            console.log(order);

        } else {

            console.log('Could not find any order with this id');
        }
    })
}

cli.responders.signup24h = function (str) {

    // List users
    -_data.list('users', function (err, users) {
        if (!err && users) {

            for (let user of users) {

                // List user and get data
                _data.read('users', user, function (err, userData) {

                    if (!err && userData) {

                        const yesterday24h = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

                        const dateUserCreated = userData.created_at;


                        if (dateUserCreated > yesterday24h.getTime()) {

                            console.log(userData);
                        }

                    } else {

                        console.log('Could not found any user with this id.')
                    }


                });

            }





        } else {
            console.log('Could not list any users');
        }

    });

}


cli.responders.userByEmail = function (str) {
    // Cut the '--' 
    const strArray = str.split('--');
    // Get the params
    const userEmail = strArray[1];

    _data.list('users', function (err, users) {

        if (!err && users) {

            for(let user of users ) {

                _data.read('users', user, function(err, userdata) {

                    if(!err && userdata) {

                        if(userdata.email == userEmail) {

                            console.log(userdata);
                        }


                    } else {

                        console.log('Could not routed any user');

                    }

                });
            }

        } else {

            console.log('Could not find any user');
        }
    })
}


// Create a vertical space
cli.verticalSpace = function (lines) {
    lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('');
    }
};

// Create a horizontal line across the screen
cli.horizontalLine = function () {

    // Get the available screen size
    var width = process.stdout.columns;

    // Put in enough dashes to go across the screen
    var line = '';
    for (i = 0; i < width; i++) {
        line += '-';
    }
    console.log(line);


};

// Create centered text on the screen
cli.centered = function (str) {
    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : '';

    // Get the available screen size
    var width = process.stdout.columns;

    // Calculate the left padding there should be
    var leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    var line = '';
    for (i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);
};




// Cli Helper / man
cli.responders.exit = function () {

    process.exit();

}

// Input processor 
cli.processInput = function (str) {

    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : false;

    // Only process the input if user actually write something.
    if (str) {

        // Codify unique string that indentify questions
        const uniqueInputs = [
            'man',
            'help',
            'allmenus',
            'allorder24',
            'orderbyid',
            'signup24h',
            'userbyemail',
            'exit'
        ];

        // Emit event if found input string
        let matchFound = false;
        let counter = 0;

        uniqueInputs.some(function (input) {

            if (str.toLowerCase().indexOf(input) > -1) {

                matchFound = true;

                // emit event
                e.emit(input, str);

                return true;
            }
        });
        // if no match, tell the user to try again
        if (!matchFound) {

            console.log('Command Not Found, try again');

        }


    }

}

// Init script
cli.init = function () {

    // Send  the start message to the console, in dark blue
    console.log('\x1b[34m%s\x1b[0m', "The CLI is on");

    // Start the interface
    const _interface = readline.createInterface({

        input: process.stdin,
        output: process.stdout,
        prompt: ''

    });


    // Create an initial prompt

    _interface.prompt();


    // Handle each line of input separately
    _interface.on('line', function (str) {

        // Send to input processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();

    });

    // If the user stops cli, kill the associated process
    _interface.on('close', function () {

        process.exit(0);

    });


};



// Exports module
module.exports = cli;
