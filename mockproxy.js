

var request = require("superagent");

getBucket = function(method, path) {
  var defer = protractor.promise.defer();

  console.log("path", path);
  console.log("method", method);
  console.log("url", "http://localhost:8082/ngp/postbucket/?path=" + path + "&random=" + Math.random(1,Math.pow(10, 10)));

  if(method==="PUT") {
    request
      .get("http://localhost:8082/ngp/putbucket/?path=" + path + "&random=" + Math.random(1,Math.pow(10, 10)))
      .end(function(error, res){
        defer.fulfill(res.body);
      });
  } else if(method==="POST") {
    request
      .get("http://localhost:8082/ngp/postbucket/?path=" + path + "&random=" + Math.random(1,Math.pow(10, 10)))
      .end(function(error, res){
        defer.fulfill(res.body);
      });
  }

  return defer.promise;
};


var mockproxy = function() {

  var portNr = "8082";

  var Agent = require('agentkeepalive');

  var keepaliveAgent = new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
  });

  var data = {};
  var lastMockProxy = {};

  function post(params) {
    var defer = protractor.promise.defer();

    request
      .post("http://localhost:" + portNr + "/ngp/mockapi/")
      .send(params)
      .agent(keepaliveAgent)
      .end(function(error, res){
        defer.fulfill(res.body);
      });

    return defer.promise;
  }

  this.setPort = function (_portNr_) {
    portNr = _portNr_;
  }

  this.setConfig = function(_data_) {
    data = _data_;
    lastMockProxy = {};
  };
  this.set = function(which) {

    if(lastMockProxy.which == which) {
      return lastMockProxy.return;
    }

    
    lastMockProxy.return = post({
      path: data[which]["path"],
      useAlternative: data[which]["useAlternative"],
      delay: data[which]["delay"],
      passThrough: data[which]["passThrough"],
      method: data[which]["method"]
    });

    return lastMockProxy.return;

  };

  
  this.getBucket = function(method, path) {
    var defer = protractor.promise.defer();

    console.log("path", path);
    console.log("method", method);
    console.log("url", "http://localhost:8082/ngp/postbucket/?path=" + path + "&random=" + Math.random(1,Math.pow(10, 10)));

    if(method==="PUT") {
      request
        .get("http://localhost:8082/ngp/putbucket/?path=" + path + "&random=" + Math.random(1,Math.pow(10, 10)))
        .end(function(error, res){
          defer.fulfill(res.body);
        });
    } else if(method==="POST") {
      request
        .get("http://localhost:8082/ngp/postbucket/?path=" + path + "&random=" + Math.random(1,Math.pow(10, 10)))
        .end(function(error, res){
          defer.fulfill(res.body);
        });
    }

    return defer.promise;
  };


};


module.exports = {
  "mockproxy": function(){ return new mockproxy(); }
}

