const API_KEY = "NODEJS_API_CLIENT_TEST_KEY";
const INVALID_API_KEY = "This_IS_A_BAD_API_KEY";
const EMAIL_ID = "test_fixture_1";
const ENABLED_DRIP_ID = "dc_Rmd7y5oUJ3tn86sPJ8ESCk";
const DISABLED_DRIP_ID = "dc_AjR6Ue9PHPFYmEu2gd8x5V";
const FALSE_DRIP_ID = "false_drip_campaign_id";
const TEMPLATE = "pmaBsiatWCuptZmojWESme";

const sendwithusFactory = require("../lib/sendwithus");
const assert = require("assert").strict;

describe("Send Endpoint", function () {

  beforeEach(function () {
    this.sendwithus = new sendwithusFactory(API_KEY);
    this.sendwithusBad = new sendwithusFactory(INVALID_API_KEY);

    this.recipient = {
      name: "Company",
      address: "company@company.com",
    };

    this.incompleteRecipient = {
      name: "Company",
    };

    this.sender = {
      name: "Sender",
      address: "sender@sender.com",
    };
  });

  it("Handle when a conntection error is thrown", function (done) { 
    const data = () => {
     return new Error('ETIMEDOUT')
     return { // give invalid object to get error response
       email_id: EMAIL_ID,
       recipient: this.recipient,
       email_data: {
         hello: "World!",
       },
     };
    }

  this.sendwithus.send(data, function (err, result) {
      try {
        if (err.mesage === 'ETIMEDOUT') {
          throw new Error('ETIMEDOUT')
        } else if (err.code === 'ETIMEDOUT') { throw new Error('ETIMEDOUT') }
        done()
      } catch (e) {
        console.info(err, result)
        assert.ok(e.message, 'ETIMEDOUT');
        done(e)
      }
    });
  });

  it("should send an email successfully with no template data", function (done) {
    const data = {
      email_id: EMAIL_ID,
      recipient: this.recipient,
    };

    this.sendwithus.send(data, function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result.success, "Response was successful");
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should send an email successfully with template data", function (done) {
    const data = {
      email_id: EMAIL_ID,
      recipient: this.recipient,
      email_data: {
        hello: "World!",
      },
    };

    this.sendwithus.send(data, function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result.success, "Response was successful");
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should throw an error (400) because bad data", function (done) {
    const data = {
      email_id: EMAIL_ID,
      recipient: this.incompleteRecipient,
    };

    this.sendwithus.send(data, function (err, response) {
      try {
        assert.notStrictEqual(response.success, true, "Response was unsuccessful");
        assert.ok(err, "Error was thrown");
        assert.strictEqual(response.status, 400, "Expected 400 status code");
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should throw an error (403) because bad API key", function (done) {
    const data = {
      email_id: EMAIL_ID,
      recipient: this.incompleteRecipient,
    };

    this.sendwithusBad.send(data, function (err, response) {
      try {
        assert.notStrictEqual(response.success, true, "Response was unsuccessful");
        assert.ok(err, "Error was thrown");
        assert.strictEqual(response.status, 403, "Expected 403 status code");
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should create a valid request event", function (done) {
    const data = {
      email_id: EMAIL_ID,
      recipient: this.recipient,
      email_data: {
        hello: "World!",
      },
    };

    this.sendwithus.once("request", function (method, url, headers, body) {
      assert.strictEqual(method, "POST", "Correct HTTP method");
      assert.strictEqual(
        url,
        "https://api.sendwithus.com/api/v1/send",
        "Correct HTTP url"
      );
      assert.strictEqual(
        headers["X-SWU-API-KEY"],
        API_KEY,
        "Valid X-SWU-API-KEY"
      );
    });

    this.sendwithus.send(data, function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result.success, "Response was successful");
        done()
      } catch (e) {
        done(e)
      }
    });
  });
  it("should return with a valid response event", function (done) {
    const data = {
      email_id: EMAIL_ID,
      recipient: this.recipient,
      email_data: {
        hello: "World!",
      },
    };

    this.sendwithus.once("response", function (statusCode, body, response) {
      assert.strictEqual(statusCode, 200, "HTTP statusCode valid");
      assert.strictEqual(body.success, true, "Request successful");
      assert.strictEqual(body.status, "OK", "Request status OK");
    });

    this.sendwithus.send(data, function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result.success, "Response was successful");
        done()
      } catch (e) {
        done(e)
      }
    });
  });
});

describe("Templates Endpoint", function () {
  this.timeout(15000); // The templates endpoint can be real slow.

  beforeEach(function () {
    this.sendwithus = new sendwithusFactory(API_KEY);
    this.sendwithusBad = new sendwithusFactory(INVALID_API_KEY);

    this.templateData = {
      name: "name " + Date().toString(),
      subject: "subject",
      html: "<html><head></head><body></body></html>",
    };
  });

  it("should list templates successfully", function (done) {
    this.sendwithus.templates(function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result);
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should throw an error (403) because bad API key", function (done) {
    this.sendwithusBad.templates(function (err, response) {
      try {
        assert.ok(err, "Error was thrown");
        assert.strictEqual(response.status, 403);
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should create a new template successfully", function (done) {
    this.sendwithus.createTemplate(this.templateData, function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result.name, "Response was successful");
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should create a new template version successfully", function (done) {
    this.sendwithus.createTemplateVersion(
      TEMPLATE,
      this.templateData,
      function (err, result) {
        try {
          assert.ifError(err);
          assert.ok(result.name, "Response was successful");
          done()
        } catch (e) {
          done(e)
        }
      }
    );
  });
});

describe("Customers Endpoint", function () {
  beforeEach(function () {
    this.sendwithus = new sendwithusFactory(API_KEY);
    this.customerData = {
      email: "foo@bar.com",
      data: {
        my: "data",
      },
    };

    this.customerConversionData = {
      revenue: 2000,
    };
  });

  it("should create a customer successfully", function (done) {
    this.sendwithus.customersUpdateOrCreate(
      this.customerData,
      function (err, result) {
        try {
          assert.ifError(err);
          assert.ok(result.success, "Response was successful");
          done()
        } catch (e) {
          done(e)
        }
      }
    );
  });

  it("should delete a customer successfully", function (done) {
    const that = this;
    // Make sure customer exists
    this.sendwithus.customersUpdateOrCreate(
      this.customerData,
      function (err, result) {
        assert.ifError(err);
        assert.ok(result.success, "Response was successful");

        // Delete the customer
        that.sendwithus.customersDelete(
          that.customerData.email,
          function (err, result) {
            try {
              assert.ifError(err);
              assert.ok(result.success, "Response was successful");
              done()
            } catch (e) {
              done(e)
            }
          }
        );
      }
    );
  });
});

describe("Drip Campaigns Endpoint", function () {
  beforeEach(function () {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.recipientData = {
      recipient_address: "customer@example.com",
    };
  });

  it("should list drip campaigns successfully", function (done) {
    this.sendwithus.dripCampaignList(function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result);
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should activate a recipient successfully", function (done) {
    this.sendwithus.dripCampaignActivate(
      ENABLED_DRIP_ID,
      this.recipientData,
      function (err, result) {
        try {
          assert.ifError(err);
          assert.ok(result.success, "Response was successful");
          done()
        } catch (e) {
          done(e)
        }
      }
    );
  });

  it("should return an error (400) when activating on an inactive drip campaign", function (done) {
    this.sendwithus.dripCampaignActivate(
      DISABLED_DRIP_ID,
      this.recipientData,
      function (err, response) {
        try {
          assert.ok(err, "Error was thrown");
          assert.strictEqual(response.status, 400, "Expected 400 status code");
          assert.notStrictEqual(
            response.success,
            true,
            "Response was unsuccessful"
          );
          done()
        } catch (e) {
          done(e)
        }
      }
    );
  });

  it("should return an error (400) when activating on a drip campaign that does not exist", function (done) {
    this.sendwithus.dripCampaignActivate(
      FALSE_DRIP_ID,
      this.recipientData,
      function (err, response) {
        try {
          assert.ok(err, "Error was thrown");
          assert.strictEqual(response.status, 400, "Expected 400 status code");
          assert.notStrictEqual(
            response.success,
            true,
            "Response was unsuccessful"
          );
          done()
        } catch (e) {
          done(e)
        }
      }
    );
  });

  it.skip("should deactivate a recipient successfully", function (done) {
    // SendWithUs currently returns a 405 METHOD NOT ALLOWED error for this endpoint.
    this.sendwithus.dripCampaignDeactivate(
      ENABLED_DRIP_ID,
      this.recipientData,
      function (err, result) {
        console.log(err)
        try {
          assert.ifError(err);
          assert.ok(result.success, "Response was successful");
          done()
        } catch (e) {
          done(e)
        }
      }
    );
  });

  it("should deactivate all drip campaigns for recipient successfully", function (done) {
    this.sendwithus.dripCampaignDeactivateAll(
      this.recipientData,
      function (err, result) {
        try {
          assert.ifError(err);
          assert.ok(result.success, "Response was successful");
          done()
        } catch (e) {
          done(e)
        }
      }
    );
  });
});

describe("Render Endpoint", function () {
  beforeEach(function () {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.data = {
      template: TEMPLATE,
      template_data: {
        name: "name " + Date().toString(),
      },
      strict: false,
    };
  });

  it("should render a template successfully", function (done) {
    this.sendwithus.render(this.data, function (err, result) {
      try {
        assert.ifError(err);
        assert.ok(result.success, true);
        done()
      } catch (e) {
        done(e)
      }
    });
  });
});

describe("Resend Endpoint", function () {
  this.timeout(10000); // The resend endpoint can be real slow.
  beforeEach(function () {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.data = {
      email_id: EMAIL_ID,
      recipient: {
        address: "company@company.com",
      },
    };
  });

  it("should resend an email successfully", function (done) {
    const that = this;
    // Make sure the log exists
    this.sendwithus.send(this.data, function (err, result) {
      assert.ifError(err);
      assert.ok(result.success, true);

      const data = {
        log_id: result.receipt_id,
      };

      that.sendwithus.resend(data, function (err, result) {
        try {
          assert.ifError(err);
          assert.ok(result.success, true);
          done()
        } catch (e) {
          done(e)
        }
      });
    });
  });
});

describe("Batch Endpoint", function () {
  beforeEach(function () {
    this.sendwithus = sendwithusFactory(API_KEY);
    this.data = [
      {
        path: "/api/v1/send",
        method: "POST",
        body: {
          template: TEMPLATE,
          recipient: {
            address: "test+1@mydomain.com",
          },
        },
      },
    ];
    this.badData = [
      {
        path: "/api/v1/send",
        method: "POST",
        body: {
          template: "tem_doesntexist",
          recipient: {
            address: "test+2@mydomain.com",
          },
        },
      },
    ];
  });

  it("should create a batch request successfully", function (done) {
    this.sendwithus.batch(this.data, function (err, result) {
      try {
        assert.ifError(err);
        assert.strictEqual(result[0].status_code, 200);
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  it("should return an error (400) template not found", function (done) {
    this.sendwithus.batch(this.badData, function (err, result) {
      try {
        assert.ifError(err);
        assert.strictEqual(result[0].status_code, 400, "Template not found");
        done()
      } catch (e) {
        done(e)
      }
    });
  });
});