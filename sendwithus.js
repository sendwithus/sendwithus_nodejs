
var API = require('./lib/api');

var Sendwithus = function(key, options) {
    this.api = new API(key, options);
};

Sendwithus.prototype = {
    send: function(email_id, recipient, data) {
        var endpoint = 'send';

        var payload = {
            email_id: email_id,
            recipient: recipient,
            email_data: data
        };

        return this.api.post(endpoint, payload);
    }
};

module.exports = Sendwithus;

