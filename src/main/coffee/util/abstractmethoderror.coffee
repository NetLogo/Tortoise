# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (String) => Nothing
module.exports = (msg) -> throw new Error("Illegal method call: `#{msg}` is abstract")
