Iban  = require '../models/iban'

log = require('printit')
    date: false
    prefix: "iban"

# Retreive a list [{iban: ... , name:..., bankName: ...}, {..}, ..]
module.exports.get = (req, res, next) ->
    Iban.listIbans (err, accounts)->
    	return next err if err
    	res.send(accounts)
