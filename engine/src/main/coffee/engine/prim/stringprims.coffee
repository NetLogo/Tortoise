# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class StringPrims

  # (Number, String, String) => String
  insertItem: (n, xs, x) ->
    chars = xs.split('')
    chars.splice(n, 0, x)
    chars.join('')

  # (String, String) => Boolean
  member: (chunk, text) ->
    text.indexOf(chunk) isnt -1

  # (String, String) => Number | Boolean
  position: (chunk, text) ->
    index = text.indexOf(chunk)

    if index isnt -1
      index
    else
      false

  # (String, String) => String
  remove: (chunk, text) ->
    text.replace(new RegExp(chunk, "g"), "")

  # (Number, String) => String
  removeItem: (n, text) ->
    pre  = text.slice(0, n)
    post = text.slice(n + 1)
    pre + post

  # (Number, String, String) => String
  replaceItem: (n, text, chunk) ->
    pre  = text.slice(0, n)
    post = text.slice(n + 1)
    pre + chunk + post

  # (String) => String
  reverse: (text) ->
    text.split("").reverse().join("")

  # (String, Number, Number) => String
  substring: (text, n1, n2) ->
    text.substr(n1, n2 - n1)

module.exports = StringPrims
