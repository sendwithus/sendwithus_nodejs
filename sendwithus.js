var API = require('./lib/api');

var Sendwithus = function(key, options) {
    this.api = new API(key, options);
};

Sendwithus.prototype = {
    send: function(email_id, recipient, data, sender) {
        var endpoint = 'send';

        var payload = {
            email_id: email_id,
            recipient: recipient,
            email_data: data,
            sender: sender
        };

        return this.api.post(endpoint, payload);
    }
};

module.exports = Sendwithus;

