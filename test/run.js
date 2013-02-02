
var API = require("../sendwithus");

var key = 'THIS_IS_A_TEST_API_KEY';

var options = {
    'API_HOST': 'beta.sendwithus.com',
    'API_PORT': 80,
    'API_PROTO': 'http'
};

var api = new API(key, options);

console.log('> testing send ...');
api.send('test', 'test@sendwithus.com', {'name': 'Jimmy the snake'});

