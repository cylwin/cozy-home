// Generated by CoffeeScript 1.9.0
var fs, path;

fs = require('fs');

path = require('path');

exports.stream = null;

exports.init = (function(_this) {
  return function(compound, callback) {
    var app, logDir, logFile;
    app = compound.app;
    logDir = path.join(compound.root, 'log');
    logFile = path.join(logDir, app.get('env') + '.log');
    return fs.exists(logDir, function(exists) {
      var options;
      if (exists) {
        options = {
          flags: 'a',
          mode: 0x1b6,
          encoding: 'utf8'
        };
        exports.stream = fs.createWriteStream(logFile, options);
        return callback(exports.stream);
      } else {
        return callback(null);
      }
    });
  };
})(this);

exports.write = (function(_this) {
  return function(text) {
    var stream;
    stream = exports.stream || process.stdout;
    return stream.write(text + '\n' || console.log(text));
  };
})(this);
