
var util = require('util');
var http = require('http');
var https = require('https');
var querystring = require('querystring');

var API = function(key, options) {
    this.API_KEY = key;
    this.DEBUG = "DEBUG" in options ? options['DEBUG'] : false;

    this.API_HOST = 'API_HOST' in options ? options['API_HOST'] : 'api.sendwithus.com';
    this.API_PORT = 'API_PORT' in options ? options['API_PORT'] : '443';
    this.API_PROTO = 'API_PROTO' in options ? options['API_PROTO'] : 'https';
    this.API_VERSION = 'API_VERSION' in options ? options['API_VERSION'] : '0';
};

API.prototype = {
    post: function(endpoint, context) {
        var path = this._build_path(endpoint);
        var post_data = querystring.stringify(context);

        var options = {
            hostname: this.API_HOST,
            port: this.API_PORT,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_data.length,
                'X-SWU-API-KEY': this.API_KEY
            }
        };

        var post_req = http.request(post_options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });

        req.on('error', function(e) {
            this._debug('post_error', e);
        });

        // post the data
        post_req.write(post_data);
        post_req.end();

        return post_req;
    },

    _build_path: function(endpoint) {
        var path = util.format("/api/v%s/%s", this.API_VERSION, endpoint);

        this._debug('build_path', path);

        return path;
    }

    _debug: function(method, message) {
        if (this.DEBUG) {
            console.log('sendwithus', method, message);
        }
    }
};

module.exports = API;

