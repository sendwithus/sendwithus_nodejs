
var API = require("../sendwithus");

var key = '0b83260a5cd437d40023529f5dab7d84eeafed10';

var options = {
    'API_HOST': 'localhost',
    'API_PORT': 8000,
    'API_PROTO': 'http'
};

var api = new API(key, options);

api.send('new_user_welcome', 'test@me.com', {'name': 'Jimmy the snake'});

