var packageData       = require('../package.json');
var restler           = require('restler');
var util              = require('util');
var EventEmitter      = require('events').EventEmitter;

var API_PROTOCOL      = 'https';
var API_HOST          = 'api.sendwithus.com';
var API_VERSION       = '1_0';
var API_HEADER_KEY    = 'X-SWU-API-KEY';
var API_HEADER_CLIENT = 'X-SWU-API-CLIENT';
var API_CLIENT        = 'node-' + packageData.version;


var Sendwithus = function (apiKey, debug) {
  EventEmitter.call(this); // call the prototype constructor
  this.API_KEY = apiKey;
  this.DEBUG = debug || false;

  this._debug('Debug enabled');
};


// Extend EventEmitter
util.inherits(Sendwithus, EventEmitter);


// Create the Sendwithus prototype
var sendwithus = Sendwithus.prototype;

// Logging in debug mode
sendwithus._debug = function (str) {
  if (this.DEBUG) {
    console.log('SENDWITHUS: ' + str);
  }
};

// Build the headers for the request
sendwithus._buildHeaders = function () {
  var headers = {};
  headers[API_HEADER_KEY] = this.API_KEY;
  headers[API_HEADER_CLIENT] = API_CLIENT;

  this._debug('Set headers: ' + JSON.stringify(headers));

  return headers;
};

// Return options for a request
sendwithus._getOptions = function () {
  return {
    headers: this._buildHeaders()
  };
};

// Build the API URL from function params
sendwithus._buildUrl = function (resource, identifier, action) {
  var url = API_PROTOCOL + '://' + API_HOST + '/api/' + 'v' + API_VERSION + '/';

  if (resource) { url += resource; }
  if (identifier) { url += '/' + identifier; }
  if (action) { url += '/' + action; }

  this._debug('Built url: ' + url);

  return url;
};

sendwithus._handleResponse = function (result, response, callback) {
  if (result instanceof Error) {
    this._debug('Request Error: ' + result.stack);
    if (typeof callback === 'function') { callback(result); }
  } else if (response.statusCode === 200) {
    this.emit('response', response.statusCode, result,response);
    this._debug('Response 200: ' + JSON.stringify(result));
    if (typeof callback === 'function') { callback(null, result); }
  } else {
    this.emit('response', response.statusCode, result,response);
    this._debug('Response ' + response.statusCode + ': ' + JSON.stringify(result));

    var err = new Error('Request failed with ' + response.statusCode);
    err.statusCode = response.statusCode;

    if (typeof callback === 'function') { callback(err, result); }
  }
};

/**
* Public methods
*/

sendwithus.send = function (data, callback) {
  var url     = this._buildUrl('send');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.customersUpdateOrCreate = function (data, callback) {
  var url     = this._buildUrl('customers');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.customersDelete = function (email, callback) {
  var url     = this._buildUrl('customers', email);
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'DELETE', url, options.headers, {});
  restler
    .del(url, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.segments = function (callback) {
  var url     = this._buildUrl('segments');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'GET', url, options.headers, {});
  restler
    .get(url, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.segmentsRun = function (segment_id, callback) {
  var url     = this._buildUrl('segments', segment_id, 'run');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'GET', url, options.headers, {});
  restler
    .get(url, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.segmentsSend = function (segment_id, data, callback) {
  var url     = this._buildUrl('segments', segment_id, 'send');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.dripCampaignList = function (callback) {
  var url     = this._buildUrl('drip_campaigns');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'GET', url, options.headers, {});
  restler
    .get(url, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.dripCampaignDetails = function (drip_campaign_id, callback) {
  var url     = this._buildUrl('drip_campaigns', drip_campaign_id);
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'GET', url, options.headers, {});
  restler
    .get(url, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.dripCampaignActivate = function (drip_campaign_id, data, callback) {
  var url     = this._buildUrl('drip_campaigns', drip_campaign_id, 'activate');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.dripCampaignDeactivate = function (drip_campaign_id, data, callback) {
  var url     = this._buildUrl('drip_campaigns', drip_campaign_id, 'deactivate');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.dripCampaignDeactivateAll = function (data, callback) {
  var url     = this._buildUrl('drip_campaigns', 'deactivate');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.addCustomerEvent = function (customerAddress, data, callback) {
  var url     = this._buildUrl('customers', customerAddress, 'conversions');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.conversionEvent = function (customerAddress, data, callback) {
  var url     = this._buildUrl('customers', customerAddress, 'conversions');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.templateList = function (callback) {
  var url     = this._buildUrl('templates');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'GET', url, options.headers, {});
  restler
    .get(url, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.templateCreate = function (data, callback) {
  var url     = this._buildUrl('templates');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};

sendwithus.templateVersionCreate = function (templateId, data, callback) {
  var url     = this._buildUrl('templates', templateId, 'versions');
  var options = this._getOptions();
  var that    = this;

  this.emit('request', 'POST', url, options.headers, data);
  restler
    .postJson(url, data, options)
    .once('complete', function (result, response) {
      that._handleResponse.call(that, result, response, callback);
    });
};


/**
* Alias methods
* NOTE: These may be removed in further versions of the client
*/

// alias for templateList
sendwithus.emails = function (callback) {
  return this.templateList(callback);
};

// alias for templateCreate
sendwithus.createTemplate = function (data, callback) {
  return this.templateCreate(data, callback);
};

// alias for templateVersionCreate
sendwithus.createTemplateVersion = function (templateId, data, callback) {
  return this.templateVersionCreate(templateId, data, callback);
};


// Export all the things
module.exports = function (apiKey, debug) {
  return new Sendwithus(apiKey, debug);
};
