var API_KEY         = 'THIS_IS_A_TEST_API_KEY';
var INVALID_API_KEY = 'This_IS_A_BAD_API_KEY';
var EMAIL_ID        = 'test_fixture_1';

var sendwithusFactory = require('../lib/sendwithus');

module.exports.send = {
	setUp: function(callback) {
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
	tearDown: function(callback) {
		callback();
	},
	noData: function(test) {
		var that = this;
		var data = {
			email_id: EMAIL_ID,
			recipient: this.recipient
		};

		this.sendwithus.send(data, function(err, data) {
			test.ifError(err);
			test.ok(data.success, 'response was not successful');
			test.done();
		});
	},
	withData: function(test) {
		var that = this;
		var data = {
			email_id: EMAIL_ID,
			recipient: this.recipient,
			email_data: { hello: 'World!' }
		};

		this.sendwithus.send(data, function(err, data) {
			test.ifError(err);
			test.ok(data.success, 'response was not successful');
			test.done();
		});
	},
	incompleteRecipient: function(test) {
		var that = this;
		var data = {
			email_id: EMAIL_ID,
			recipient: this.imcompleteRecipient
		};

		this.sendwithus.send(data, function(err, data) {
			test.ok(err, 'no error was thrown');
			test.equals(err.statusCode, 400, 'Wrong status code');
			test.notStrictEqual(data.success, true, 'response was successful');
			test.done();
		});
	},
	invalidAPIKey: function(test) {
		var that = this;
		var data = {
			email_id: EMAIL_ID,
			recipient: this.imcompleteRecipient
		};

		this.sendwithusBad.send(data, function(err, data) {
			test.ok(err, 'no error was thrown');
			test.equals(err.statusCode, 403, 'Wrong status code');
			test.notStrictEqual(data.success, true, 'response was successful');
			test.done();
		});
	}
};

module.exports.emails = {
	setUp: function(callback) {
		this.sendwithus    = sendwithusFactory(API_KEY);
		this.sendwithusBad = sendwithusFactory(INVALID_API_KEY);

		callback();
	},
	tearDown: function(callback) {
		callback();
	},
	list: function(test) {
		this.sendwithus.emails(function(err, data) {
			test.ifError(err);
			test.done();
		});
	},
	listInvalidAPIKey: function(test) {
		this.sendwithusBad.emails(function(err, data) {
			test.ok(err);
			test.equals(err.statusCode, 403, 'Wrong status code');
			test.done();
		});
	}
};

module.exports.customers = {
	setUp: function(callback) {
		this.sendwithus = sendwithusFactory(API_KEY);
        this.customerData = {
            email: 'foo@bar.com',
            data: { my: 'data' }
        };

		callback();
	},
	tearDown: function(callback) {
		callback();
	},
	create: function(test) {
		this.sendwithus.customersUpdateOrCreate(this.customerData, function(err, data) {
			test.ifError(err);
			test.ok(data.success, 'response was not successful');
            test.equals(data.customer.email, 'foo@bar.com', 'Email address didnt match');
			test.done();
		});
	},
    del: function(test) {
        // Make sure customer exists
        var that = this;
		this.sendwithus.customersUpdateOrCreate(this.customerData, function(err, data) {
			test.ifError(err);
			test.ok(data.success, 'response was not successful');
            test.equals(data.customer.email, 'foo@bar.com', 'Email address didnt match');

            // Delete the customer
            that.sendwithus.customersDelete(that.customerData.email, function(err, data) {
                test.ifError(err);
                test.ok(data.success, 'response was not successful');
                test.done();
            });
		});

    }
};
