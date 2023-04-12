# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

escapeRegEx = (s) ->
  s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')

module.exports = {
  escapeRegEx
}
