BaseCollection = require 'lib/base_collection'
Iban = require 'models/application'



# List of ibans for bank account.
module.exports = class IbanCollection extends BaseCollection

    model: Iban
    url: 'api/ibans/'
