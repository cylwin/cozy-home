cozydb = require 'cozydb'
async = require 'async'

Bank = cozydb.getModel 'Bank',
    uuid: String
    name: String

module.exports = BankAccount = cozydb.getModel 'Bankaccount',
    bank : String
    title: String
    iban : String


BankAccount.listIbans = (callback)->
    Bank.request "byUuid", {}, (err, banks)->
        groupedByUuidBank = {};
        for bank in banks
            groupedByUuidBank[bank.uuid] = bank

        BankAccount.request "all", {}, (err, accounts)->
            listIbans = []
            for account in accounts
                if account.iban
                    listIbans.push account
                    account.bankName = groupedByUuidBank[account.bank].name

            callback null, listIbans


