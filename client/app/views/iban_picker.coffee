Modal                = require '../views/modal'
template             = require '../templates/iban_picker'


module.exports = class PhotoPickerCroper extends Modal

################################################################################
## PUBLIC SECTION

# Class attributes


# Methods

    events: -> _.extend super,
        'click a.next': 'submit'


    initialize: (params, cb) ->
        ####
        # init config & state and super
        @id     = 'object-picker'
        @title  = t('pick iban')

        @config =
            cssSpaceName    : "object-picker"
            singleSelection : true # tells if user can select one or more photo
            yes             : t 'modal ok'
            no              : t 'modal cancel'
            cb              : cb  # will be called by onYes
        @params = params
        @state =
            currentStep : 'objectPicker' # 2 states : 'croper' & 'objectPicker'
            img_naturalW: 0  # natural width  (px) of the selected file
            img_naturalH: 0  # natural height (px) of the selected file
        @el.dataset.step = @state.currentStep
        super(@config)
        ####
        # get elements
        body              = @el.querySelector '.modalCY-body'
        body.innerHTML    = template({ibans : []})
        @body             = body

        # @collection.fetch()
        # @listenTo @collection, 'all', =>
        # I have a problem to solve with my collection, I used a $.get to bypass
        # this problem
        $.get "api/ibans", (ibans)->
            body.innerHTML = template({ibans : ibans})

        return true


    # overload the modal behavour : "ok" leads to the cropping step
    onYes: ->
        iban = $('input[name=iban]:checked').val()
        @cb null, iban
        @close()

    resizeHandler: (event) =>
        if @state.activePanel.resizeHandler
            @state.activePanel.resizeHandler()




