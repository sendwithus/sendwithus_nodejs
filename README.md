sendwithus node-client
========================

[![Build Status](https://travis-ci.org/sendwithus/sendwithus_nodejs.png)](https://travis-ci.org/sendwithus/sendwithus_nodejs)

## Installation

```
npm install sendwithus
```

# Usage

All callbacks accept `err` and `response`:

```javascript
var callback = function(err, response) {
    if (err) {
        console.log(err.statusCode, response);
    } else {
        console.log(response);
    }
};
```

# Templates

## List Your Templates

```javascript
var api = require('sendwithus')('API_KEY');
api.templates(callback);
```

### Create Template

```javascript
var api = require('sendwithus')('API_KEY');
var data = { name: 'name', subject: 'subject', html: '<html><head></head><body></body></html>', text: 'some text' };
api.createTemplate(data, callback);
```

### Create Template Version

```javascript
var api = require('sendwithus')('API_KEY');
var data = { name: 'name', subject: 'subject', html: '<html><head></head><body></body></html>', text: 'some text' };
api.createTemplateVersion(TEMPLATE_ID, data, callback);
```

# Send

## Send an Email

*NOTE* - If a customer does not exist by the specified email (recipient address), the send call will create a customer.

- template                  &mdash; Template ID to send
- recipient
   - address                &mdash; The recipient's email address
   - name (optional)        &mdash; The recipient's name
- template_data (optional)     &mdash; Object containing email template data
- sender (optional)
   - address                &mdash; The sender's email address
   - reply_to (optional)    &mdash; The sender's reply-to address
   - name (optional)        &mdash; The sender's name
- cc (optional)             &mdash; An array of CC recipients, of the format {"address":"cc@email.com"}
- bcc (optional)            &mdash; An array of BCC recipients, of the format {"address":"bcc@email.com"}
- headers (optional)         &mdash; Object contain SMTP headers to be included with the email
- esp\_account (optional)   &mdash; ID of the ESP Account to send this email through. ex: esp\_1a2b3c4d5e
- locale (optional)         &mdash; Template locale to send (ie: en-US)
- version_name (optional)   &mdash; Template version to send (ie: Version A)

### Call with REQUIRED parameters only

The `template_data` field is optional, but highly recommended!

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: 'TEMPLATE_ID',
    recipient: { address: 'us@sendwithus.com' }
}, callback);
```

### Call with REQUIRED parameters and template_data

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: 'TEMPLATE_ID',
    recipient: {
        address: 'us@sendwithus.com', // required
        name: 'Matt and Brad'
    },
    template_data: { first_name: 'Matt' }
}, callback);
```

### Optional Sender

`sender['address']` is a required sender field

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: 'TEMPLATE_ID',
    recipient: { address: 'us@sendwithus.com' },
    template_data: { first_name: 'Matt' },
    sender: {
        address: 'company@company.com', // required
        name: 'Company'
    }
}, callback);
```

### Optional Sender with reply_to address

`sender['name']` and `sender['reply_to']` are both optional

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: 'TEMPLATE_ID',
    recipient: { address: 'us@sendwithus.com' },
    template_data: { first_name: 'Matt' },
    sender: {
        address: 'company@company.com', // required
        name: 'Company',
        reply_to: 'info@company.com'
    }
}, callback);
```

### Optional BCC/CC

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: TEMPLATE_ID,
    recipient: { address: 'us@sendwithus.com' },
    bcc: [{ address: 'bcc@sendwithus.com' }],
    cc: [
        { address: 'cc1@sendwithus.com' },
        { address: 'cc2@sendwithus.com' }
    ]
}, callback);
```

### Optional Headers

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: TEMPLATE_ID,
    recipient: { address: 'us@sendwithus.com' },
    headers:{ 'X-HEADER-ONE': 'header-value' }
}, callback);
```

### Optional ESP Account

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: TEMPLATE_ID,
    recipient: { address: 'us@sendwithus.com' },
    esp_account:'esp_1234asdf1234'
}, callback);
```

### Optional Locale

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: TEMPLATE_ID,
    recipient: { address: 'us@sendwithus.com' },
    locale:'en-US'
}, callback);
```

### Optional Version

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    template: TEMPLATE_ID,
    recipient: { address: 'us@sendwithus.com' },
    version_name:'Version A'
}, callback);
```

# Customers

### Update or Create a Customer

```javascript
var api = require('sendwithus')('API_KEY');
api.customersUpdateOrCreate({ email: 'foo@bar.com', data: { name: 'Bob' } }, callback);
```

### Delete a Customer


```javascript
var api = require('sendwithus')('API_KEY');
api.customersDelete('foo@bar.com', callback);
```

# Drip Campaigns

### List Drip Campaigns

```javascript
var api = require('sendwithus')('API_KEY');
api.dripCampaignList(callback);
```

### Show Drip Campaign Details

```javascript
var api = require('sendwithus')('API_KEY');
api.dripCampaignDetails('DRIP_CAMPAIGN_ID', callback);
```

### Start Customer on a Drip Campaign

```javascript
var api = require('sendwithus')('API_KEY');
var data = {
  recipient: {
    address: 'RECIPIENT_ADDRESS',
    name: 'RECIPIENT_NAME'
  },
  email_data: {
    country: 'Latveria'
  }
}
api.dripCampaignActivate('DRIP_CAMPAIGN_ID', data, callback);
```

### Remove Customer from a Single Drip Campaign

```javascript
var api = require('sendwithus')('API_KEY');
var data = { recipient_address: 'RECIPIENT_ADDRESS' };
api.dripCampaignDeactivate('DRIP_CAMPAIGN_ID', data, callback);
```

### Remove Customer from **All** Drip Campaigns

```javascript
var api = require('sendwithus')('API_KEY');
var data = { recipient_address: 'RECIPIENT_ADDRESS' };
api.dripCampaignDeactivateAll(data, callback);
```

### Expected Response

#### Success

```javascript
  > response.status;
  OK

  > response.success;
  True

  > response.receipt_id;
  'numeric-receipt-id'

```

#### Error cases

* malformed request

```javascript
    > err.statusCode;
    400
```

* bad API key

```javascript
    > err.statusCode;
    403
```

# Render

### Render an Email

```javascript
var api = require('sendwithus')('API_KEY');
api.render({ template: 'SAMPLE_TEMPLATE_ID', template_data: { name: 'Bob' }, strict: true }, callback);
```
### Optional Locale
```javascript
var api = require('sendwithus')('API_KEY');
api.render({ 
    template: 'SAMPLE_TEMPLATE_ID', 
    template_data: { name: 'Bob' },
    locale: 'en-US',
    strict: true 
}, callback);
```
### Optional Template Version
```javascript
var api = require('sendwithus')('API_KEY');
api.render({ 
    template: 'SAMPLE_TEMPLATE_ID', 
    template_data: { name: 'Bob' },
    version_id: 'SAMPLE_VERSION_ID',
    strict: true 
}, callback);
```
### Sample Response
```javascript
{
    "success": true,
    "status": "OK",
    "template": {
        "id": "ver_r4nd0ml3tt3rsv15h4l0l",
        "name": "Template name",
        "version_name": "Template version name",
        "locale": "en-US"
    },
    "subject": "RENDERED SUBJECT WITH DATA",
    "html": "RENDERED HTML BODY WITH DATA",
    "text": "RENDERED TEXT BODY WITH DATA"
}
```

## Events

* `request: function(method, url, headers, body)` - emitted when a request has been sent to Sendwithus
* `response: function(statusCode, body, response)` - emitted when a response has been received back from Sendwithus

## Run Tests

Install requirements

```
npm install
```

Run Unit Tests

```
npm test
```

## Troubleshooting

### General Troubleshooting

-   Enable debug mode
-   Make sure you're using the latest Node client
-   Capture the response data and check your logs &mdash; often this will have the exact error

### Enable Debug Mode

Debug mode prints out the underlying request information as well as the data payload that gets sent to Sendwithus. You will most likely find this information in your logs. To enable it, simply put `debug=true` as a parameter when instantiating the API object. Use the debug mode to compare the data payload getting sent to [Sendwithus' API docs](https://www.sendwithus.com/docs/api "Official Sendwithus API Docs").

```javascript
var api = require('sendwithus')('API_KEY', debug=true);
```
### Response Ranges

Sendwithus' API typically sends responses back in these ranges:

-   2xx – Successful Request
-   4xx – Failed Request (Client error)
-   5xx – Failed Request (Server error)

If you're receiving an error in the 400 response range follow these steps:

-   Double check the data and ID's getting passed to Sendwithus
-   Ensure your API key is correct
-   Log and check the body of the response
