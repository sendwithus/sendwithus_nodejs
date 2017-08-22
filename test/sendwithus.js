var API_KEY = 'NODEJS_API_CLIENT_TEST_KEY';
var INVALID_API_KEY = 'This_IS_A_BAD_API_KEY';
var EMAIL_ID = 'test_fixture_1';
var ENABLED_DRIP_ID = 'dc_Rmd7y5oUJ3tn86sPJ8ESCk';
var DISABLED_DRIP_ID = 'dc_AjR6Ue9PHPFYmEu2gd8x5V';
var FALSE_DRIP_ID = 'false_drip_campaign_id';
var TEMPLATE = 'pmaBsiatWCuptZmojWESme';

var sendwithusFactory = require('../lib/sendwithus');

module.exports.send = {
  setUp: function (callback) {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.sendwithusBad = sendwithusFactory(INVALID_API_KEY);

    this.recipient = {
      name: 'Company',
      address: 'company@company.com'
    };

    this.imcompleteRecipient = {
      name: 'Company'
    };

    this.sender = {
      name: 'Sender',
      address: 'sender@sender.com'
    };

    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  noData: function (test) {
    var that = this;
    var data = {
      email_id: EMAIL_ID,
      recipient: this.recipient
    };

    this.sendwithus.send(data, function (err, result) {
      test.ifError(err);
      test.ok(result.success, 'Response was successful');
      test.done();
    });
  },
  withData: function (test) {
    var that = this;
    var data = {
      email_id: EMAIL_ID,
      recipient: this.recipient,
      email_data: {
        hello: 'World!'
      }
    };

    this.sendwithus.send(data, function (err, result) {
      test.ifError(err);
      test.ok(result.success, 'Response was successful');
      test.done();
    });
  },
  incompleteRecipient: function (test) {
    var that = this;
    var data = {
      email_id: EMAIL_ID,
      recipient: this.imcompleteRecipient
    };

    this.sendwithus.send(data, function (err, result) {
			test.notStrictEqual(result.success, true, 'Response was unsuccessful');
			test.ok(err, 'Error was thrown');
      test.equals(err.statusCode, 400, 'Expected 400 status code');
      test.done();
    });
  },
  invalidAPIKey: function (test) {
    var that = this;
    var data = {
      email_id: EMAIL_ID,
      recipient: this.imcompleteRecipient
    };

    this.sendwithusBad.send(data, function (err, result) {
			test.notStrictEqual(result.success, true, 'Response was unsuccessful');
      test.ok(err, 'Error was thrown');
      test.equals(err.statusCode, 403, 'Expected 403 status code');
      test.done();
    });
  },
  requestEventValid: function (test) {
    var that = this;
    var data = {
      email_id: EMAIL_ID,
      recipient: this.recipient,
      email_data: {
        hello: 'World!'
      }
    };

    this.sendwithus.once('request', function (method, url, headers, body) {
      test.equals(method, 'POST', 'Correct HTTP method');
      test.equals(url, 'https://api.sendwithus.com/api/v1/send', 'Correct HTTP url');
      test.equals(headers['X-SWU-API-KEY'], API_KEY, 'Valid X-SWU-API-KEY');
      test.done();
    });

    this.sendwithus.send(data, function (err, result) {
      test.ifError(err);
      test.ok(result.success, 'Response was successful');
    });
  },
  responseEventValid: function (test) {
    var that = this;
    var data = {
      email_id: EMAIL_ID,
      recipient: this.recipient,
      email_data: {
        hello: 'World!'
      }
    };

    this.sendwithus.once('response', function (statusCode, body, response) {
      test.equals(statusCode, 200, 'HTTP statusCode valid');
      test.equals(body.success, true, 'Request successful');
      test.equals(body.status, 'OK', 'Request status OK');
      test.done();
    });

    this.sendwithus.send(data, function (err, result) {
      test.ifError(err);
      test.ok(result.success, 'Response was successful');
    });
  }
};

module.exports.emails = {
  setUp: function (callback) {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.sendwithusBad = sendwithusFactory(INVALID_API_KEY);

    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  list: function (test) {
    this.sendwithus.emails(function (err, result) {
      test.ifError(err);
      test.done();
    });
  },
  listInvalidAPIKey: function (test) {
    this.sendwithusBad.emails(function (err, result) {
      test.ok(err, 'API Key was invalid');
      test.equals(err.statusCode, 403, 'Expected 403 status code');
      test.done();
    });
  }
};

module.exports.customers = {
  setUp: function (callback) {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.customerData = {
      email: 'foo@bar.com',
      data: {
        my: 'data'
      }
    };

    this.customerConversionData = {
      revenue: 2000
    };

    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  create: function (test) {
    this.sendwithus.customersUpdateOrCreate(this.customerData, function (err, result) {
			test.ifError(err);
      test.ok(result.success, 'Response was successful');
      test.done();
    });
  },
  del: function (test) {
    // Make sure customer exists
    var that = this;
    this.sendwithus.customersUpdateOrCreate(this.customerData, function (err, result) {
      test.ifError(err);
      test.ok(result.success, 'Response was successful');

      // Delete the customer
      that.sendwithus.customersDelete(that.customerData.email, function (err, result) {
        test.ifError(err);
        test.ok(result.success, 'Response was successful');
        test.done();
      });
    });
  }
};

module.exports.dripCampaigns = {
  setUp: function (callback) {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.recipientData = {
      recipient_address: 'customer@example.com'
    };

    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  listCampaigns: function (test) {
    this.sendwithus.dripCampaignList(function (err, result) {
      test.ifError(err);
      test.done();
    });
  },
  listCampaignsDetails: function (test) {
    this.sendwithus.dripCampaignDetails(ENABLED_DRIP_ID, function (err, result) {
      test.ifError(err);
      test.equals(result.object, 'drip_campaign');
      test.done();
    });
  },
  activateOnEnabledCampaign: function (test) {
    this.sendwithus.dripCampaignActivate(ENABLED_DRIP_ID, this.recipientData, function (err, result) {
      test.ifError(err);
      test.ok(result.success, 'Response was successful');
      test.done();
    });
  },
  activateOnDisabledCampaign: function (test) {
    this.sendwithus.dripCampaignActivate(DISABLED_DRIP_ID, this.recipientData, function (err, result) {
			test.ok(err, 'Error was thrown');
      test.equals(err.statusCode, 400, 'Expected 400 status code');
			test.notStrictEqual(result.success, true, 'Response was unsuccessful');
      test.done();
    });
  },
  activateOnFalseCampaign: function (test) {
    this.sendwithus.dripCampaignActivate(FALSE_DRIP_ID, this.recipientData, function (err, result) {
      test.ok(err, 'Error was thrown');
      test.equals(err.statusCode, 400, 'Expected 400 status code');
			test.notStrictEqual(result.success, true, 'Response was unsuccessful');
      test.done();
    });
  },
  deactivateCampaignForCustomer: function (test) {
    this.sendwithus.dripCampaignDeactivate(ENABLED_DRIP_ID, this.recipientData, function (err, result) {
      test.ifError(err);
      test.ok(result.success, 'Response was successful');
      test.done();
    });
  },
  deactivateAllCampaignsForCustomer: function (test) {
    this.sendwithus.dripCampaignDeactivateAll(this.recipientData, function (err, result) {
      test.ifError(err);
      test.done();
    });
  }
};

module.exports.createTemplates = {
  setUp: function (callback) {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.templateData = {
      name: 'name ' + Date().toString(),
      subject: 'subject',
      html: '<html><head></head><body></body></html>'
    };

    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  createTemplate: function (test) {
    this.sendwithus.createTemplate(this.templateData, function (err, result) {
      test.ifError(err);
      test.ok(result.name, 'Response was successful');
      test.done();
    });
  },
  createTemplateVersion: function (test) {
    this.sendwithus.createTemplateVersion(TEMPLATE, this.templateData, function (err, result) {
      test.ifError(err);
      test.ok(result.name, 'Response was successful');
      test.done();
    });
  }
};
