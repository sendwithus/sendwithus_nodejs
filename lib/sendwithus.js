var restler     = require('restler');
var packageData = require('../package.json');

var API_PROTOCOL       = 'https';
var API_HOST           = 'beta.sendwithus.com';
var API_VERSION        = '1_0';
var API_HEADER_KEY     = 'X-SWU-API-KEY';
var API_HEADER_CLIENT  = 'X-SWU-API-CLIENT';
var API_CLIENT         = 'node-' + packageData.version;

var Sendwithus = function Sendwithus(apiKey, debug) {
	this.API_KEY = apiKey;
	this.DEBUG = debug || false;

	this._debug('Debug enabled');
};

Sendwithus.prototype._debug = function(str) {
	if (this.DEBUG) {
		console.log('SENDWITHUS: ' + str);
	}
};

Sendwithus.prototype._buildHeaders = function() {
	var headers = { };
	headers[API_HEADER_KEY] = this.API_KEY;
	headers[API_HEADER_CLIENT] = API_CLIENT;

	this._debug('Set headers: ' + JSON.stringify(headers));

	return headers;
};

Sendwithus.prototype._getOptions = function() {
	return { 
		headers: this._buildHeaders()
	};
};

Sendwithus.prototype._buildUrl = function(endpoint) {
	var url = API_PROTOCOL + '://' +
						API_HOST + '/api/' +
						'v' + API_VERSION + '/';

	if (endpoint) {
		url += endpoint;
	}

	this._debug('Built url: ' + url);

	return url;
};

Sendwithus.prototype._handleResponse = function(result, response, callback) {
	if (response.statusCode === 200) {
		callback(null, result);
		this._debug('Response 200: ' + JSON.stringify(result));
	} else {
		this._debug('Response ' + response.statusCode + ': ' + JSON.stringify(result));
		var err = new Error('Request failed with ' + response.statusCode);
		err.statusCode = response.statusCode;
		callback(err, result);
	}
};


////////////////////////////
// PUBLIC METHODS 

Sendwithus.prototype.send = function(data, callback) {
	var url = this._buildUrl('send');

	var options = this._getOptions();

	var that = this;
	restler
		.postJson(url, data, options)
		.once('complete', function(result, response) {
			that._handleResponse.call(that, result, response, callback);
		});
};

Sendwithus.prototype.emails = function(callback) {
	var url = this._buildUrl('emails');

	var options = this._getOptions();

	var that = this;
	restler
		.get(url, options)
		.once('complete', function(result, response) {
			that._handleResponse.call(that, result, response, callback);
		});
};


module.exports = function(apiKey, debug) {
	return new Sendwithus(apiKey, debug);
};