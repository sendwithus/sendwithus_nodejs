
var Sendwithus = function(key, options) {
    this.API_KEY = key;

    this.API_HOST = "API_HOST" in options ? options['API_HOST'] : "api.sendwithus.com";
    this.API_PORT = "API_PORT" in options ? options['API_PORT'] : "443";
    this.API_PROTO = "API_PROTO" in options ? options['API_PROTO'] : "https";
    this.API_VERSION = "API_VERSION" in options ? options['API_VERSION'] : "0";
    this.API_HEADER_KEY = "X-SWU-API-KEY";
    this.DEBUG = "DEBUG" in options ? options['DEBUG'] : false;
};

Sendwithus.prototype = {
    send: function(email_name, email_to, context) {
    
    };
};

module.exports = Sendwithus;
