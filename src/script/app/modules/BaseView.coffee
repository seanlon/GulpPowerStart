# require all necessary modules for this view
Backbone = require "backbone"
_ = require "lodash"


module.exports = class BaseView extends Backbone.View

  parseData: () ->
    console.log 'parseData :> '
    console.log 'parseData <: '
    return if @model then @model.toJSON() else {}

  setModel: (model) ->
    console.log 'setModel :> '
    @model = model
    console.log 'setModel <: '
 

  render: () ->
    console.log 'render :> '
    # render the template with models data
    @$el.html(@template(@model ))
    console.log 'render <: '
    return @

  remove: ->
    console.log 'remove :> '
    super()
    console.log 'remove <: '
    return @
