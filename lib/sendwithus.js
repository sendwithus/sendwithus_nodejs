var fetch = require("node-fetch").default;
var packageData = require("../package.json");
var events = require("events");
var util = require("util");

var API_PROTOCOL = "https";
var API_HOST = "api.sendwithus.com";
var API_VERSION = "1";
var API_HEADER_KEY = "X-SWU-API-KEY";
var API_HEADER_CLIENT = "X-SWU-API-CLIENT";
var API_CLIENT = "node-" + packageData.version;

var Sendwithus = function Sendwithus(apiKey, debug) {
  events.EventEmitter.call(this); // call the prototype ctor
  this.API_KEY = apiKey;
  this.DEBUG = debug || false;

  this._debug("Debug enabled");
};

// extend the EventEmitter
util.inherits(Sendwithus, events.EventEmitter);

Sendwithus.prototype._debug = function (str) {
  if (this.DEBUG) {
    console.log("SENDWITHUS: " + str);
  }
};

Sendwithus.prototype._buildHeaders = function () {
  var headers = {};
  headers[API_HEADER_KEY] = this.API_KEY;
  headers[API_HEADER_CLIENT] = API_CLIENT;

  this._debug("Set headers: " + JSON.stringify(headers));

  return headers;
};

Sendwithus.prototype._getOptions = function () {
  return {
    headers: this._buildHeaders(),
  };
};

Sendwithus.prototype._buildUrl = function (resource, identifier, action) {
  var url = API_PROTOCOL + "://" + API_HOST + "/api/" + "v" + API_VERSION + "/";

  if (resource) {
    url += resource;
  }
  if (identifier) {
    url += "/" + identifier;
  }
  if (action) {
    url += "/" + action;
  }

  this._debug("Built url: " + url);

  return url;
};

Sendwithus.prototype._fetchBoilerplate = async function (url, args) {

  const response = await fetch(url, args);

  try {
    const result = await response.json();
    return { response, result };
  } 
  catch (error) {
    return { response, result: error };
  }

};

Sendwithus.prototype._fetch = function (callback) {
  var that = this;

  return {
    postJson: (url, data, options) => {
      return this._fetchBoilerplate(url, {
        method: "post",
        body: JSON.stringify(data),
        ...options,
      })
      .then(({ response, result }) => {
        that._handleResponse.call(that, result, response, callback);
      })
      .catch(({ response, result }) => { that._handleResponse.call(that, result, response, callback); });
    },
    get: (url, options) => {
      return this._fetchBoilerplate(url, {
        method: "get",
        ...options,
      })
      .then(({ response, result }) => {
        that._handleResponse.call(that, result, response, callback);
      })
      .catch(({ response, result }) => { that._handleResponse.call(that, result, response, callback); });
    },
    del: (url, options) => {
      return this._fetchBoilerplate(url, {
        method: "delete",
        ...options,
      })
      .then(({ response, result }) => {
        that._handleResponse.call(that, result, response, callback);
      })
      .catch(({ response, result }) => { that._handleResponse.call(that, result, response, callback); });
    },
  };
};

Sendwithus.prototype._handleResponse = function (result, response, callback) {
  if (result instanceof Error) {
    this._debug("Request Error: " + result.stack);
    if (typeof callback == "function") {
      callback(result, response);
    }
  } else if (response.ok) { //  the range 200-299 means the response was successful and should not return an error. https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
    this.emit("response", response.status, result, response);
    this._debug(`Response ${response.status}: ` + JSON.stringify(result));
    if (typeof callback == "function") {
      callback(null, result, response);
    }
  } 
  // handle anything which is an error outside of the instaceof Error type
  else if (result && result.stack && result.message) { 
    this._debug("Response " + response.status + ": " + JSON.stringify(result));
    var err = new Error("Request failed with " + response.status);
    err.statusCode = response.status;
    if (typeof callback == "function") {
      callback(err, result);
    }
  }
  else {
    // handle anything else outside errors level responses which are not errors (100, and 300 response group).
    this.emit("response", response.status, result, response);
    this._debug(`Response ${response.status}: ` + JSON.stringify(result));
    if (typeof callback == "function") {
      callback(null, result);
    }
  }
};

////////////////////////////
// PUBLIC METHODS

Sendwithus.prototype.batch = function (data, callback) {
  var url = this._buildUrl("batch");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.send = function (data, callback) {
  var url = this._buildUrl("send");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.render = function (data, callback) {
  var url = this._buildUrl("render");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.templates = function (callback) {
  var url = this._buildUrl("templates");
  var options = this._getOptions();
  this.emit("request", "GET", url, options.headers, {});
  this._fetch(callback).get(url, options)
};

/* 'emails' is a deprecated method since Sendwithus has changed their language
 * slightly. This is still kept around for backwards compatibility.
 */
Sendwithus.prototype.emails = Sendwithus.prototype.templates;

Sendwithus.prototype.customersUpdateOrCreate = function (data, callback) {
  var url = this._buildUrl("customers");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.customersDelete = function (email, callback) {
  var url = this._buildUrl("customers", email);
  var options = this._getOptions();
  this.emit("request", "DELETE", url, options.headers, {});
  this._fetch(callback).del(url, options)
};

Sendwithus.prototype.dripCampaignList = function (callback) {
  var url = this._buildUrl("drip_campaigns");
  var options = this._getOptions();
  this.emit("request", "GET", url, options.headers, {});
  this._fetch(callback).get(url, options)
};

Sendwithus.prototype.dripCampaignDetails = function (
  drip_campaign_id,
  callback
) {
  var url = this._buildUrl("drip_campaigns", drip_campaign_id);
  var options = this._getOptions();
  this.emit("request", "GET", url, options.headers, {});
  this._fetch(callback).get(url, options)
};

Sendwithus.prototype.dripCampaignActivate = function (
  drip_campaign_id,
  data,
  callback
) {
  var url = this._buildUrl("drip_campaigns", drip_campaign_id, "activate");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.dripCampaignDeactivate = function (
  drip_campaign_id,
  data,
  callback
) {
  var url = this._buildUrl("drip_campaigns", drip_campaign_id, "deactivate");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).del(url, options);
};

Sendwithus.prototype.dripCampaignDeactivateAll = function (data, callback) {
  var url = this._buildUrl("drip_campaigns", "deactivate");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.createTemplate = function (data, callback) {
  var url = this._buildUrl("templates");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.createTemplateVersion = function (
  templateId,
  data,
  callback
) {
  var url = this._buildUrl("templates", templateId, "versions");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

Sendwithus.prototype.resend = function (data, callback) {
  var url = this._buildUrl("resend");
  var options = this._getOptions();
  this.emit("request", "POST", url, options.headers, data);
  this._fetch(callback).postJson(url, data, options)
};

module.exports = function (apiKey, debug) {
  return new Sendwithus(apiKey, debug);
};
