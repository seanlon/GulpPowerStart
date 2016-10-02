$ = require "jquery"

COOKIE_ACCEPT_NAME = 'cookieAccept'

class Storage
  constructor: () ->
    @useSessionStorage = false

  setItem: (key, value) ->
    return window.localStorage.setItem(key, value)

  getItem: (key) ->
    return window.localStorage.getItem(key)

  remove: ->
    window.localStorage.clear()

storage = new Storage()
module.exports = storage
