// Generated by CoffeeScript 1.9.3
var Notification, cozydb;

cozydb = require('cozydb');

module.exports = Notification = cozydb.getModel('Notification', {
  text: String,
  type: String,
  resource: {
    type: cozydb.NoSchema,
    "default": null
  },
  publishDate: {
    type: String,
    "default": Date.now
  },
  app: String,
  ref: String
});

Notification.all = function(callback) {
  return Notification.request("all", callback);
};
