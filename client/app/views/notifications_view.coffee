ViewCollection = require 'lib/view_collection'
SocketListener = require 'lib/socket_listener'
Notification = require 'models/notification'

SocketListener = require '../lib/socket_listener'

module.exports = class NotificationsView extends ViewCollection

    el:'#notifications-container'
    itemView: require 'views/notification_view'
    template: require 'templates/notifications'

    events:
        "click #notifications-toggle": "showNotifList"
        "click #clickcatcher"        : "hideNotifList"

    initialize: ->
        super
        @initializing = true

    appendView: (view) ->
        @notifList ?= $ '#notifications-list'
        @notifList.prepend view.el
        @sound.play() unless @initializing
        @$('#notifications-toggle img').attr 'src', 'img/notification-orange.png'
        @$('#notifications-toggle').addClass 'highlight'

    afterRender: =>
        @counter    = @$ '#notifications-counter'
        @counter.html '10'
        @clickcatcher = @$ '#clickcatcher'
        @clickcatcher.hide()
        @noNotifMsg = $ '#no-notif-msg'
        @notifList  = $ '#notifications-list'
        @sound      = $('#notification-sound')[0]
        @dismissButton = $ "#dismiss-all"
        @dismissButton.click @dismissAll

        super
        @initializing = false
        @collection.fetch()
        #$(window).on 'click', @windowClicked

    remove: =>
        #$(window).off 'click', @hideNotifList
        super

    checkIfEmpty: =>
        newCount = @collection.length
        @noNotifMsg.toggle(newCount is 0)
        @dismissButton.toggle(newCount isnt 0)
        if newCount is 0 #hide 0 counter
            @counter.html ""
            @counter.hide()
            imgPath = 'img/notification-white.png'
            @$('#notifications-toggle img').attr 'src', imgPath
            @$('#notifications-toggle').removeClass 'highlight'
        else
            @counter.html newCount
            @counter.show()

    windowClicked: =>
        if event? and @$el.has($(event.target)).length is 0
            @hideNotifList()

    showNotifList: () ->
        if @notifList.is ':visible'
            @notifList.hide()
            @clickcatcher.hide()
            @$el.removeClass 'active'
        else
            @$el.addClass 'active'
            @notifList.show()
            @clickcatcher.show()

    dismissAll: =>
        @dismissButton.spin true
        @collection.removeAll
            success: =>
                @dismissButton.spin false
            error: =>
                @dismissButton.spin false

    hideNotifList: (event) =>
        @notifList.hide()
        @clickcatcher.hide()
        @$el.removeClass 'active'
