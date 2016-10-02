_ = require "underscore"

module.exports =

  ifCond: (v1, v2, options) ->
    if v1 == v2
      return options.fn(this)
    options.inverse this

  ifNotCond: (v1, v2, options) ->
    if v1 != v2
      return options.fn(this)
    options.inverse this

  contains: (v1, v2) ->
    if v1 && v2 && v1.indexOf(v2) < 0
      return true
    return false

  toUpperCase: (value) ->
    return if _.isString(value) then value.toUpperCase() else value

  ifHasNot: (v1, v2, options) ->
    if v1 && v2 && v1.indexOf(v2) < 0
      return options.fn(this)
    options.inverse this

  ifHas: (v1, v2, options) ->
    if v1 && v2 && v1.indexOf(v2) >= 0
      return options.fn(this)
    options.inverse this

  increment: (value) ->
    return ++value

