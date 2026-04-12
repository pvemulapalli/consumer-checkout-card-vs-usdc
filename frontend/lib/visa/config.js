const cybersourceRestClient = require("cybersource-rest-client");

function configuration() {
  this.authenticationType = "jwt";
  this.runEnvironment = "apitest.cybersource.com";

  this.merchantID = process.env.VISA_MERCHANT_ID;

  this.keyAlias = process.env.VISA_KEY_ALIAS;
  this.keyPass = process.env.VISA_KEY_PASS;
  this.keyFileName = "resource/lilysboutique_sandbox001.p12";

  this.useMetaKey = false;
  this.enableLog = true;
}

module.exports = configuration;