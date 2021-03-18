# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

# (String) => Nothing
module.exports = (msg) -> throw exceptions.internal("Illegal method call: `#{msg}` is abstract")
