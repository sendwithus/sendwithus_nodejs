
var util = require('util');
var http = require('http');
var https = require('https');
var querystring = require('querystring');

var API = function(key, options) {
    options = options || { };

    this.API_KEY = key;
    this.DEBUG = options.hasOwnProperty('DEBUG') ? options['DEBUG'] : false;

    this.API_HOST = options.hasOwnProperty('API_HOST') ? options['API_HOST'] : 'beta.sendwithus.com';
    this.API_PORT = options.hasOwnProperty('API_PORT') ? options['API_PORT'] : '443';
    this.API_PROTO = options.hasOwnProperty('API_PROTO') ? options['API_PROTO'] : 'https';
    this.API_VERSION = options.hasOwnProperty('API_VERSION') ? options['API_VERSION'] : '1_0';
};

API.prototype = {
    post: function(endpoint, context) {
        var self = this;
        var path = this._build_path(endpoint);
        var body = JSON.stringify(context);

        var options = {
            hostname: this.API_HOST,
            port: this.API_PORT,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length,
                'X-SWU-API-KEY': this.API_KEY
            }
        };

        var r_type = (this.API_PROTO == 'http' ? http : https);

        var request = r_type.request(options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                self._debug('reponse', chunk);
            });
        });

        request.on('error', function(e) {
            self._debug('post_error', e);
        });

        request.end(body);

        return request;
    },

    _build_path: function(endpoint) {
        var path = util.format("/api/v%s/%s", this.API_VERSION, endpoint);

        this._debug('build_path', path);

        return path;
    },

    _debug: function(method, message) {
        if (this.DEBUG) {
            console.log('sendwithus ' + method + ':', message);
        }
    }
};

module.exports = API;

