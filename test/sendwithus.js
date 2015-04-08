var API_KEY          = 'THIS_IS_A_TEST_API_KEY';
var INVALID_API_KEY  = 'This_IS_A_BAD_API_KEY';
var EMAIL_ID         = 'test_fixture_1';
var ENABLED_DRIP_ID  = 'dc_Rmd7y5oUJ3tn86sPJ8ESCk';
var DISABLED_DRIP_ID = 'dc_AjR6Ue9PHPFYmEu2gd8x5V';
var FALSE_DRIP_ID    = 'false_drip_campaign_id';
var TEMPLATE         = 'pmaBsiatWCuptZmojWESme';

var sendwithusFactory = require('../lib/sendwithus');

module.exports = {

  send: {

    setUp: function (callback) {
      this.sendwithus    = sendwithusFactory(API_KEY);
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

      this.sendwithus.send(data, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
        test.done();
      });
    },

    withData: function (test) {
      var that = this;
      var data = {
        email_id: EMAIL_ID,
        recipient: this.recipient,
        email_data: { hello: 'World!' }
      };

      this.sendwithus.send(data, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
        test.done();
      });
    },

    incompleteRecipient: function (test) {
      var that = this;
      var data = {
        email_id: EMAIL_ID,
        recipient: this.imcompleteRecipient
      };

      this.sendwithus.send(data, function (err, data) {
        test.ok(err, 'no error was thrown');
        test.equals(err.statusCode, 400, 'Wrong status code');
        test.notStrictEqual(data.success, true, 'response was successful');
        test.done();
      });
    },

    invalidAPIKey: function (test) {
      var that = this;
      var data = {
        email_id: EMAIL_ID,
        recipient: this.imcompleteRecipient
      };

      this.sendwithusBad.send(data, function (err, data) {
        test.ok(err, 'no error was thrown');
        test.equals(err.statusCode, 403, 'Wrong status code');
        test.notStrictEqual(data.success, true, 'response was successful');
        test.done();
      });
    },

    requestEventValid: function (test) {
      var that = this;
      var data = {
        email_id: EMAIL_ID,
        recipient: this.recipient,
        email_data: { hello: 'World!' }
      };

      this.sendwithus.once('request', function (method,url,headers,body) {
        test.equals(method, 'POST', 'wrong HTTP method');
        test.equals(url, 'https://api.sendwithus.com/api/v1_0/send', 'wrong HTTP url');
        test.equals(headers['X-SWU-API-KEY'], API_KEY, 'invalid X-SWU-API-KEY');
        test.done();
      });

      this.sendwithus.send(data, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
      });
    },

    responseEventValid: function (test) {
      var that = this;
      var data = {
        email_id: EMAIL_ID,
        recipient: this.recipient,
        email_data: { hello: 'World!' }
      };

      this.sendwithus.once('response',function (statusCode, body, response) {
        test.equals(statusCode, 200, 'HTTP statusCode invalid');
        test.equals(body.success, true, 'success invalid');
        test.equals(body.status, 'OK', 'status invalid');
        test.done();
      });

      this.sendwithus.send(data, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
      });
    }

  },

  customers: {
    setUp: function (callback) {
      this.sendwithus   = sendwithusFactory(API_KEY);
      this.customerData = {
        email: 'foo@bar.com',
        data: { my: 'data' }
      };

      this.customerConversionData = { revenue: 2000 };

      callback();
    },

    tearDown: function (callback) {
      callback();
    },

    create: function (test) {
      this.sendwithus.customersUpdateOrCreate(this.customerData, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
        test.equals(data.customer.email, 'foo@bar.com', 'Email address didnt match');
        test.done();
      });
    },

    addEvent: function (test) {
      this.sendwithus.addCustomerEvent('foo@bar.com', this.customerConversionData, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
        test.done();
      });
    },

    conversionEvent: function (test) {
      this.sendwithus.conversionEvent('foo@bar.com', this.customerConversionData, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
        test.done();
      });
    },

    del: function (test) {
      // Make sure customer exists
      var that = this;
      this.sendwithus.customersUpdateOrCreate(this.customerData, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
          test.equals(data.customer.email, 'foo@bar.com', 'Email address didnt match');

          // Delete the customer
          that.sendwithus.customersDelete(that.customerData.email, function (err, data) {
            test.ifError(err);
            test.ok(data.success, 'response was not successful');
            test.done();
          });
      });
    }
  },

  dripCampaigns: {

    setUp: function (callback) {
      this.sendwithus    = sendwithusFactory(API_KEY);
      this.recipientData = { recipient_address: 'customer@example.com' };

      callback();
    },

    tearDown: function (callback) {
        callback();
    },

    listCampaigns: function (test) {
      this.sendwithus.dripCampaignList(function (err, data) {
        test.ifError(err);
        test.done();
      });
    },

    listCampaignsDetails: function (test) {
      this.sendwithus.dripCampaignDetails(ENABLED_DRIP_ID, function (err, data) {
        test.ifError(err);
        test.equals(data.object, 'drip_campaign');
        test.done();
      });
    },

    activateOnEnabledCampaign: function (test) {
      this.sendwithus.dripCampaignActivate(ENABLED_DRIP_ID, this.recipientData, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
        test.done();
      });
    },

    activateOnDisabledCampaign: function (test) {
      this.sendwithus.dripCampaignActivate(DISABLED_DRIP_ID, this.recipientData, function (err, data) {
        test.ok(err, 'no error was thrown');
        test.equals(err.statusCode, 400, 'Wrong status code');
        test.done();
      });
    },

    activateOnFalseCampaign: function (test) {
      this.sendwithus.dripCampaignActivate(FALSE_DRIP_ID, this.recipientData, function (err, data) {
        test.ok(err, 'no error was thrown');
        test.equals(err.statusCode, 400, 'Wrong status code');
        test.done();
      });
    },

    deactivateCampaignForCustomer: function (test) {
      this.sendwithus.dripCampaignDeactivate(ENABLED_DRIP_ID, this.recipientData, function (err, data) {
        test.ifError(err);
        test.ok(data.success, 'response was not successful');
        test.done();
      });
    },

    deactivateAllCampaignsForCustomer: function (test) {
      this.sendwithus.dripCampaignDeactivateAll(this.recipientData, function (err, data) {
        test.ifError(err);
        test.done();
      });
    }

  },

  templates: {

    setUp: function (callback) {
      this.sendwithus    = sendwithusFactory(API_KEY);
      this.sendwithusBad = sendwithusFactory(INVALID_API_KEY);
      this.templateData  = {
        name: 'name',
        subject: 'subject',
        html: '<html><head></head><body></body></html>'
      };

      callback();
    },

    tearDown: function (callback) {
      callback();
    },

    templateList: function (test) {
      this.sendwithus.templateList(function (err, data) {
        test.ifError(err);
        test.done();
      });
    },

    templateListInvalidAPIKey: function (test) {
      this.sendwithusBad.templateList(function (err, data) {
        test.ok(err);
        test.equals(err.statusCode, 403, 'Wrong status code');
        test.done();
      });
    },

    createTemplate: function (test) {
      this.sendwithus.createTemplate(this.templateData, function (err, data) {
        test.ifError(err);
        test.ok(data.name, 'response was not successful');
        test.done();
      });
    },

    createTemplateVersion: function (test) {
      this.sendwithus.createTemplateVersion(TEMPLATE, this.templateData, function (err, data) {
        test.ifError(err);
        test.ok(data.name, 'response was not successful');
        test.done();
      });
    }

  }

};
