sendwithus node-client
========================

[![Build Status](https://travis-ci.org/sendwithus/sendwithus_nodejs.png)](https://travis-ci.org/sendwithus/sendwithus_nodejs)

## Installation

```
npm install sendwithus
```

# Usage

All callbacks accept `err` and `data`:

```javascript
var callback = function(err, data) {
    if (err) {
        console.log(err, err.statusCode);
    } else {
        console.log(data);
    }
};
```

## List Your Emails

```javascript
var api = require('sendwithus')('API_KEY');
api.emails(callback);
```

## Send an Email


### Call with REQUIRED parameters only


The `email_data` field is optional, but highly recommended!

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    email_id: 'EMAIL_ID',
    recipient: { address: 'us@sendwithus.com'}
}, callback);
```

### Call with REQUIRED parameters and email_data


```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    email_id: 'EMAIL_ID',
    recipient: {
        address: 'us@sendwithus.com', // required
        name: 'Matt and Brad'
    },
    email_data: { first_name: 'Matt' }
}, callback);
```

### Optional Sender


`sender['address']` is a required sender field

```javascript
var api = require('sendwithus')('API_KEY');
api.send({
    email_id: 'EMAIL_ID',
    recipient: { address: 'us@sendwithus.com'},
    email_data: { first_name: 'Matt' },
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
    email_id: 'EMAIL_ID',
    recipient: { address: 'us@sendwithus.com'},
    email_data: { first_name: 'Matt' },
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
    email_id: EMAIL_ID,
    recipient: { address: 'us@sendwithus.com'},
    bcc: [{ address: 'bcc@sendwithus.com' }],
    cc: [
        { address: 'cc1@sendwithus.com' },
        { address: 'cc2@sendwithus.com' }
    ]
}, callback);
```

## Update or Create a Customer


```javascript
var api = require('sendwithus')('API_KEY');
api.customersUpdateOrCreate({ email: 'foo@bar.com', data: { name: 'Bob' } }, callback);
```

## Delete a Customer


```javascript
var api = require('sendwithus')('API_KEY');
api.customersDelete('foo@bar.com', callback);
```

## List Segments


```javascript
var api = require('sendwithus')('API_KEY');
api.segments(callback);
```

## Run a Segment


```javascript
var api = require('sendwithus')('API_KEY');
api.segmentsRun('SEGMENT_ID', callback);
```

## Send Email to a Segment


```javascript
var api = require('sendwithus')('API_KEY');
var data = { email_id: 'EMAIL_ID', email_data: { subject: 'Hello World' } };
api.segmentsSend(SEGMENT_ID, data, callback);
```

## List Drip Campaigns

```javascript
var api = require('sendwithus')('API_KEY');
api.dripCampaignList(callback);
```

## Show Drip Campaign Details

```javascript
var api = require('sendwithus')('API_KEY');
api.dripCampaignDetails('DRIP_CAMPAIGN_ID', callback);
```

## Start Customer on a Drip Campaign

```javascript
var api = require('sendwithus')('API_KEY');
var data = { recipient_address: 'RECIPIENT_ADDRESS' };
api.dripCampaignActivate('DRIP_CAMPAIGN_ID', data, callback);
```

## Remove Customer from a Drip Campaign

```javascript
var api = require('sendwithus')('API_KEY');
var data = { recipient_address: 'RECIPIENT_ADDRESS' };
api.dripCampaignDeactivate('DRIP_CAMPAIGN_ID', data, callback);
```

## expected response


### Error cases


#### malformed request


```javascript
    > err.statusCode;
    400
```

#### bad api key


```javascript
    > err.statusCode;
    403
```

## Run Tests

Install requirements

```
npm install
```

Run Unit Tests

```
npm test
```
