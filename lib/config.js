/*
*  
* variables configuring production, and developer mode
*
*/


// container for all environments

const environments = {};


// Default environments (staging)
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envname': 'staging',
    'hashingSecret' : 'thisIsaSecret',
    'maxChecks': 5,
    'twilio' : {
        'accountsId': '',
        'authToken': '',
        'fromPhone': ''
      },
      'mailGun':{
        'apiKey':'',
		'baseUrl':'',
		'sandboxDomain':'',
		'defaultEmail':''
    },
    'templateGlobals' : {
        'appName': 'Shop Online',
        'companyName': 'Test Shop',
        'user_firstName': 'User',
        'yearCreated': '2019',
        'baseUrl': 'https://localhost:3000/'

    }

};

// Production environments
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envname': 'production',
    'hashingSecret' : 'thisIsaSecret',
    'maxChecks': 5,
    'twilio' : {
        'accountsId': '',
        'authToken': '',
        'fromPhone': ''
    },
    'mailGun':{
		'apiKey':'',
		'baseUrl':'',
		'sandboxDomain':'',
		'defaultEmail':''
    },
    'templateGlobals' : {
        'appName': 'Shop Online',
        'companyName': 'Test Shop',
        'yearCreated': '2019',
        'baseUrl': 'https://localhost:3000/'

    }   

    

}

// Current environmet
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check current environment is one above, if not, set default environment

const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


// export 
module.exports = environmentToExport;