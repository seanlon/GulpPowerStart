$ = require "jquery"
 
Storage = require "../component/storage"
Chunk = require "../util/chunk"
Constants = require "../config/Constants"
MainController = require "./modules/MainController"

class App
  constructor: ->
    console.log 'constructor :> '
    @_initConfig()
    console.log 'constructor <: '

# Add any config here
  _initConfig: ->
    console.log '_initConfig :> '
    @name = Constants.NAME
    @description  = Constants.DESCRIPTION
    @path  = Constants.PATH
    @mainController = new MainController()
    console.log '_initConfig <: '



module.exports = new App()
