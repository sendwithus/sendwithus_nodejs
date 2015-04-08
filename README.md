Sendwithus NodeJS Client
========================

[![NPM](https://nodei.co/npm/sendwithus.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/sendwithus/)

[![Build Status](https://travis-ci.org/sendwithus/sendwithus_nodejs.png)](https://travis-ci.org/sendwithus/sendwithus_nodejs)

## Installation

```
npm install sendwithus
```

# Usage

All callbacks follow the Node convention of `err` and `data` respectively as function params:

```javascript
var callback = function (err, data) {
  if (err) {
    console.log(err, err.statusCode);
  } else {
    console.log(data);
  }
};
```


# API

To start using this module, instantiate it with your sendwithus API key:

```javascript
var api = require('sendwithus')('API_KEY');
```

## Send an email

### Call with REQUIRED parameters only

The `email_data` field is optional, but highly recommended!

```javascript
api.send({
  email_id: 'EMAIL_ID',
  recipient: { 
    address: 'us@sendwithus.com'
  }
}, callback);
```

### Call with REQUIRED parameters and email_data

```javascript
api.send({
  email_id: 'EMAIL_ID',
  recipient: {
    address: 'us@sendwithus.com', // required
    name: 'Matt and Brad'
  },
  email_data: { first_name: 'Matt' }
}, callback);
```

### Optional sender

`sender['address']` is a required sender field

```javascript
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

### Optional sender with reply_to address

`sender['name']` and `sender['reply_to']` are both optional

```javascript
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


## Customers

### Update or create a customer

```javascript
api.customersUpdateOrCreate({
  email: 'foo@bar.com',
  data: { name: 'Bob' }
}, callback);
```

### Delete a customer

```javascript
api.customersDelete('foo@bar.com', callback);
```

## Events

### Conversions

You can use the Conversion API to track conversion and revenue data events against your sent emails

**NOTE:** Revenue is in cents (eg. $100.50 = 10050)

```javascript
var conversionData = { 'revenue': 10050 };
api.conversionEvent('foo@bar.com', conversionData, callback);
```

## Segments

### List segments

```javascript
api.segments(callback);
```

### Run a segment

```javascript
api.segmentsRun('SEGMENT_ID', callback);
```

### Send email to a segment

```javascript
var data = { 
  email_id: 'EMAIL_ID', 
  email_data: { subject: 'Hello World' }
};
api.segmentsSend(SEGMENT_ID, data, callback);
```


## Drip Campaigns

### List drip campaigns

```javascript
api.dripCampaignList(callback);
```

### Show drip campaign details

```javascript
api.dripCampaignDetails('DRIP_CAMPAIGN_ID', callback);
```

## Start customer on a drip campaign

```javascript
var data = { recipient_address: 'RECIPIENT_ADDRESS' };
api.dripCampaignActivate('DRIP_CAMPAIGN_ID', data, callback);
```

## Remove customer from a single drip campaign

```javascript
var data = { recipient_address: 'RECIPIENT_ADDRESS' };
api.dripCampaignDeactivate('DRIP_CAMPAIGN_ID', data, callback);
```


## Remove customer from **All** drip campaigns

```javascript
var data = { recipient_address: 'RECIPIENT_ADDRESS' };
api.dripCampaignDeactivateAll(data, callback);
```


## Expected responses

### Error cases

#### Malformed request

```javascript
> err.statusCode;
400
```

#### Bad api key

```javascript
> err.statusCode;
403
```

## Events

* `request: function (method, url, headers, body)` - emitted when a request has been sent to sendwithus
* `response: function (statusCode, body, response)` - emitted when a response has been received back from sendwithus


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. We also ask that you lint and test your code prior to creating a Pull Request.

### Run Tests

Install requirements

```
npm install
```

Run Unit Tests

```
npm test
```
