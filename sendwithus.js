
var API = require('./lib/api');

var Sendwithus = function(key, options) {
    this.api = new API(key, options);
};

Sendwithus.prototype = {
    send: function(email_name, email_to, context) {
        var endpoint = 'send';

        context.email_name = email_name;
        context.email_to = email_to;

        return this.api.post(endpoint, context);
    
    };
};

module.exports = Sendwithus;

