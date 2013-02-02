
var API = require('./lib/api');

var Sendwithus = function(key, options) {
    this.api = new API(key, options);
};

Sendwithus.prototype = {
    send: function(email_name, email_to, data) {
        var endpoint = 'send';

        var payload = {
            email_name: email_name,
            email_to: email_to,
            email_data: data
        }

        return this.api.post(endpoint, payload);
    }
};

module.exports = Sendwithus;

