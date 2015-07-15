// Generated by CoffeeScript 1.9.3
var Application, HttpClient, Manifest, cozydb, dataClient, getToken;

cozydb = require('cozydb');

Manifest = require('../lib/manifest').Manifest;

HttpClient = require("request-json").JsonClient;

dataClient = new HttpClient("http://localhost:9101/");

module.exports = Application = cozydb.getModel('Application', {
  name: String,
  displayName: String,
  description: String,
  slug: String,
  state: String,
  isStoppable: {
    type: Boolean,
    "default": false
  },
  date: {
    type: Date,
    "default": Date.now
  },
  icon: String,
  iconPath: String,
  iconType: String,
  color: {
    type: String,
    "default": null
  },
  git: String,
  errormsg: String,
  errorcode: String,
  branch: String,
  port: Number,
  homeposition: Object,
  widget: String,
  version: String,
  comment: String,
  needsUpdate: {
    type: Boolean,
    "default": false
  },
  favorite: {
    type: Boolean,
    "default": false
  }
});

getToken = function() {
  var err, token;
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    try {
      token = process.env.TOKEN;
      return token;
    } catch (_error) {
      err = _error;
      console.log(err.message);
      console.log(err.stack);
      return null;
    }
  } else {
    return "";
  }
};

Application.createAccess = function(access, callback) {
  dataClient.setBasicAuth('home', getToken());
  access.type = "application";
  return dataClient.post('access/', access, function(err, res, body) {
    return callback(err, new Application(body));
  });
};

Application.prototype.destroyAccess = function(callback) {
  dataClient.setBasicAuth('home', getToken());
  return dataClient.del("access/" + this.id + "/", callback);
};

Application.prototype.updateAccess = function(access, callback) {
  dataClient.setBasicAuth('home', getToken());
  access.type = "application";
  return dataClient.put("access/" + this.id + "/", access, function(err, res, body) {
    return callback(err, new Application(body));
  });
};

Application.all = function(params, callback) {
  return Application.request("bySlug", params, callback);
};

Application.destroyAll = function(params, callback) {
  return Application.requestDestroy("all", params, callback);
};

Application.prototype.checkForUpdate = function(callback) {
  var manifest, setFlag;
  setFlag = (function(_this) {
    return function() {
      return _this.updateAttributes({
        needsUpdate: true
      }, function(err) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, true);
        }
      });
    };
  })(this);
  if (this.needsUpdate) {
    return callback(null, true);
  } else {
    manifest = new Manifest();
    return manifest.download(this, (function(_this) {
      return function(err) {
        var repoVersion;
        if (err) {
          return callback(err);
        } else {
          repoVersion = manifest.getVersion();
          if (repoVersion == null) {
            return callback(null, false);
          } else if (_this.version == null) {
            return setFlag();
          } else if (_this.version !== repoVersion) {
            return setFlag();
          } else {
            return callback(null, false);
          }
        }
      };
    })(this));
  }
};

Application.prototype.getHaibuDescriptor = function() {
  var descriptor;
  descriptor = {
    user: this.slug,
    name: this.slug,
    domain: "127.0.0.1",
    repository: {
      type: "git",
      url: this.git
    },
    scripts: {
      start: "server.coffee"
    },
    password: this.password
  };
  if ((this.branch != null) && this.branch !== "null") {
    descriptor.repository.branch = this.branch;
  }
  return descriptor;
};
