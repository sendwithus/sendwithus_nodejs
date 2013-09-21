
var API = require("../sendwithus");

var key = 'THIS_IS_A_TEST_API_KEY';

var options = {
    'DEBUG': true
};

var api = new API(key, options);

console.log('> testing send ...');

api.send('test_fixture_1', { address: 'test@sendwithus.com' }, {'name': 'Jimmy the snake'});

