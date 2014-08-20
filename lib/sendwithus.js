var restler     = require('restler');
var packageData = require('../package.json');

var API_PROTOCOL       = 'https';
var API_HOST           = 'api.sendwithus.com';
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

Sendwithus.prototype._buildUrl = function(resource, identifier, action) {
    var url = API_PROTOCOL + '://' + API_HOST + '/api/' + 'v' + API_VERSION + '/';

    if (resource) { url += resource; }
    if (identifier) { url += '/' + identifier; }
    if (action) { url += '/' + action; }

    this._debug('Built url: ' + url);

    return url;
};

Sendwithus.prototype._handleResponse = function(result, response, callback) {
    if (result instanceof Error) {
        this._debug('Request Error: ' + result.stack);
        if (typeof callback == 'function') { callback(result); }
    } else if (response.statusCode === 200) {
        this._debug('Response 200: ' + JSON.stringify(result));
        if (typeof callback == 'function') { callback(null, result); }
    } else {
        this._debug('Response ' + response.statusCode + ': ' + JSON.stringify(result));

        var err = new Error('Request failed with ' + response.statusCode);
        err.statusCode = response.statusCode;

        if (typeof callback == 'function') { callback(err, result); }
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

Sendwithus.prototype.customersUpdateOrCreate = function(data, callback) {
    var url = this._buildUrl('customers');

    var options = this._getOptions();

    var that = this;
    restler
        .postJson(url, data, options)
        .once('complete', function(result, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.customersDelete = function(email, callback) {
    var url = this._buildUrl('customers', email);

    var options = this._getOptions();

    var that = this;
    restler
        .del(url, options)
        .once('complete', function(result, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.segments = function(callback) {
    var url = this._buildUrl('segments');

    var options = this._getOptions();

    var that = this;
    restler
        .get(url, options)
        .once('complete', function(result, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.segmentsRun = function(segment_id, callback) {
    var url = this._buildUrl('segments', segment_id, 'run');

    var options = this._getOptions();

    var that = this;
    restler
        .get(url, options)
        .once('complete', function(result, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.segmentsSend = function(segment_id, data, callback) {
    var url = this._buildUrl('segments', segment_id, 'send');

    var options = this._getOptions();

    var that = this;
    restler
        .postJson(url, data, options)
        .once('complete', function(result, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.dripCampaignList = function() {
    var url = this._buildUrl('drip_campaigns');

    var options = this._getOptions();

    var that = this;
    restler
        .get(url, options)
        .once('complete', function(result, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.dripCampaignListSteps = function(drip_campaign_id) {
    var url = this._buildUrl('drip_campaigns', drip_campaign_id, 'steps');

    var options = this._getOptions();

    var that = this;
    restler
        .get(url, options)
        .once('complete', function(result, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.dripCampaignActivate = function(drip_campaign_id, data) {
    var url = this._buildUrl('drip_campaigns', drip_campaign_id, 'activate');

    var options = this._getOptions();

    var that = this;
    restler
        .postJson(url, data, options)
        .once('complete', function(result, data, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

Sendwithus.prototype.dripCampaignDeactivate = function(drip_campaign_id, data) {
    var url = this._buildUrl('drip_campaigns', drip_campaign_id, 'deactivate');

    var options = this._getOptions();

    var that = this;
    restler
        .postJson(url, data, options)
        .once('complete', function(result, data, response) {
            that._handleResponse.call(that, result, response, callback);
        });
};

module.exports = function(apiKey, debug) {
    return new Sendwithus(apiKey, debug);
};
