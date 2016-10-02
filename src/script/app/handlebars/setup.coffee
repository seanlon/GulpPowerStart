
Handlebars = require("handlebars-runtime")
require("handlebars-layouts")(Handlebars)
HandlebarsCompiler = require('hbsfy/runtime')

helperUtil = require("./helper")
helperPaths = "app/handlebars/helper"

for key, value of helperUtil
  HandlebarsCompiler.registerHelper(key, value  )
  Handlebars.registerHelper(key, value  )


#Handlebars.registerHelper(helper(Handlebars)) for helper in [helperUtil, helperPaths ]
#HandlebarsCompiler.registerHelper(helper(Handlebars)) for helper in [helperUtil, helperPaths ]

 

module.exports = HandlebarsCompiler
