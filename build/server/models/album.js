// Generated by CoffeeScript 1.9.3
var Album, Photo, async, cozydb, sanitize,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

cozydb = require('cozydb');

async = require('async');

Photo = require('./photo');

sanitize = function(data) {
  if (data.title != null) {
    data.title = data.title.replace(/<br>/g, "").replace(/<div>/g, "").replace(/<\/div>/g, "");
  }
  return data.date != null ? data.date : data.date = new Date();
};

module.exports = Album = (function(superClass) {
  extend(Album, superClass);

  function Album() {
    return Album.__super__.constructor.apply(this, arguments);
  }

  Album.schema = {
    id: String,
    title: String,
    description: String,
    date: Date,
    orientation: Number,
    coverPicture: String,
    clearance: cozydb.NoSchema,
    folderid: String
  };

  Album.prototype.updateAttributes = function(data) {
    sanitize(data);
    return Album.__super__.updateAttributes.apply(this, arguments);
  };

  Album.create = function(data) {
    sanitize(data);
    return Album.__super__.constructor.create.apply(this, arguments);
  };

  Album.listWithThumbs = function(callback) {
    return async.parallel([
      function(cb) {
        return Album.request('byTitle', cb);
      }, function(cb) {
        return Photo.albumsThumbs(cb);
      }
    ], function(err, results) {
      var album, albums, defaultCover, defaultCovers, i, len;
      if (err) {
        return callback(err);
      }
      albums = results[0], defaultCovers = results[1];
      for (i = 0, len = albums.length; i < len; i++) {
        album = albums[i];
        defaultCover = defaultCovers[album.id];
        if (defaultCover && !album.coverPicture) {
          album.coverPicture = defaultCover[0], album.orientation = defaultCover[1];
        }
      }
      return callback(null, albums);
    });
  };

  Album.prototype.getPublicURL = function(callback) {
    return cozydb.api.getCozyDomain((function(_this) {
      return function(err, domain) {
        var url;
        if (err) {
          return callback(err);
        }
        url = domain + "public/photos/#albums/" + _this.id;
        return callback(null, url);
      };
    })(this));
  };

  return Album;

})(cozydb.CozyModel);
