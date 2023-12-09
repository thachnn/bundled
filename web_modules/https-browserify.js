var http = require("http"), url = require("url"), https = module.exports;

for (var key in http) http.hasOwnProperty(key) && (https[key] = http[key]);

function validateParams(params) {
  if ("string" == typeof params && (params = url.parse(params)), params.protocol || (params.protocol = "https:"), 
  "https:" !== params.protocol) throw new Error('Protocol "' + params.protocol + '" not supported. Expected "https:"');
  return params;
}

https.request = function(params, cb) {
  return params = validateParams(params), http.request.call(this, params, cb);
}, https.get = function(params, cb) {
  return params = validateParams(params), http.get.call(this, params, cb);
};