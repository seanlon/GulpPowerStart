_ = require "underscore"
Backbone = require "backbone-associations"
idCounter = 0

module.exports = class NavigationModel extends Backbone.AssociatedModel
  defaults:
    title: null
    url: null
    children: []

 #convenience to associate between different model
  relations: [
    {
      type: Backbone.Many #many to one
      key: 'children'
      relatedModel: Backbone.Self
    }
  ]

  initialize: ->
    if !@get("id")
      @set("id", "nav#{idCounter}")
    idCounter++

  getTitle: ->
    return @get("title")

  getId: ->
    return @get("id")
 

  getUrl: ->
    return @get("url")

  getChildren: ->
    return @get("children") ||  []
