BaseView = require "./BaseView"
MainView = require "./MainView.coffee"
template = require "./MainView.hbs"
$ = require "jquery"

class MainController

  constructor: ->
    @_initialize()

  _initialize: ->
    console.log '_initialize:> '

# -- dummy datas  --
# better way is to fetch from diff json ajax for dev / prod
    dummyChildrenData = [
      {  "id": "1" , "title": "child 1"  },
      {  "id": "2" , "title": "child 2"  },
      {  "id": "3" , "title": "child 3"  },
      {  "id": "4" , "title": "child 4"  }]

    dummyModel =
      "name": "A widget box"
      "title": "customize title and more here..."
      "children": dummyChildrenData


    parameterMain =
      settings: "any obj here"
      width: 300
      height: 500
      model: dummyModel
      $el: $("[main-view]")
      template: template

    @mainView = new MainView( parameterMain )
    console.log '_initialize<: '
    return @mainView


  destroyMainView: ( ) ->
    @MainView.destroyMainView(  )

module.exports = MainController
