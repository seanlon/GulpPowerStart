$ = require "jquery"
_ = require "underscore"

BaseView = require "./BaseView"
MainController = require "./MainController"
 

module.exports = class MainView extends BaseView


  initialize: (_options) ->
    console.log 'initialize:> '
    @settings = _options.settings
    @width = _options.width
    @height = _options.height
    @model = _options.model
    @$el = _options.$el
    @template = _options.template
 
    @domSelectors =
      header: ".app-header"
      content: ".app-content"
      footer: ".app-footer"
  
    @render()
    console.log 'initialize<: '

  render: ( ) ->
    console.log 'render :>'
    super()
    console.log 'render <:'
    return

 
  destroyMainView: ( ) ->
    @$el.remove()

 
  openBox: (e) ->
    console.log 'openBox :>'
    alert("openBox"  )
    e.preventDefault()

    $e = $(e.currentTarget)
    target = $e.data("target")
    return if !target
    alert("openBox" + target)
    console.log 'openBox <:'
    return

  openMenu: (e) ->
    console.log 'openMenu :>'
    e.preventDefault()

    alert("openMenu"  )
    $e = $(e.currentTarget)
    target = $e.data("target")
    return if !target
    alert("openMenu" + target)
    console.log 'openMenu <:'
    return
