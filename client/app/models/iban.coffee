{BaseModel} = require 'lib/base_model'

# Describes a device installed in mycloud.
module.exports = class Iban extends Backbone.Model

    urlRoot: 'api/ibans/'
