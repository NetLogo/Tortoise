# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

EN_US = require('./en_us')

{ exceptionFactory: exceptions } = require('util/exception')

# At the moment this doesn't do much but it'd be a good place to add
# the ability to swap the current locale as needed.
# -Jeremy B November 2020

class I18nBundle

  _current = null

  constructor: () ->
    @_current = EN_US

  get: (key, args...) ->
    bundle = if @_current.hasOwnProperty(key)
      @_current
    else if @_current isnt EN_US and EN_US.hasOwnProperty(key)
      EN_US
    else
      throw exceptions.internal("Could not find a message for this key: #{key}")

    message = bundle[key]
    message(args...)
  
  switch: (locale) ->
    try
      @_current = require('i18n/' + locale)
    catch
      @_current = EN_US

module.exports = I18nBundle
