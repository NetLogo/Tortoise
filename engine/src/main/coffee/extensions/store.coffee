# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class ObjectStorage
  constructor: () ->
    @storage = {}

  # (String) => String
  getItem: (key) =>
    if (not @hasKey(key))
      throw new Error("Extension exception: Could not find a value for key: '#{key}'.")
    return @storage[key]

  # (String, String) => Unit
  setItem: (key, value) =>
    @storage[key] = value
    return

  # (String) => Unit
  removeItem: (key) =>
    if (@hasKey(key))
      delete @storage[key]
    return

  # (String) => Boolean
  hasKey: (key) =>
    return @storage.hasOwnProperty(key)

  # () => String[]
  getKeys: =>
    return Object.getOwnPropertyNames(@storage)

  # () => Unit
  clear: =>
    @storage = {}

class LocalStorage extends ObjectStorage
  constructor: (localStorage) ->
    super()
    @localStorage = localStorage
    storage = @localStorage.getItem('nlw-store-extension')
    @storage = if (storage?) then JSON.parse(storage) else {}
    return

  # (String, String) => Unit
  setItem: (key, value) =>
    super(key, value)
    @localStorage.setItem('nlw-store-extension', JSON.stringify(@storage))
    return

  # (String) => Unit
  removeItem: (key) =>
    super(key)
    @localStorage.setItem('nlw-store-extension', JSON.stringify(@storage))
    return

  # () => Unit
  clear: =>
    super()
    @localStorage.setItem('nlw-store-extension', JSON.stringify(@storage))
    return

module.exports = {

  init: (workspace) ->
    storage = if (window?.localStorage?) then new LocalStorage(window.localStorage) else new ObjectStorage()

    {
      name: "store"
    , prims: {
        "CLEAR":    storage.clear,
        "GET":      storage.getItem,
        "GET-KEYS": storage.getKeys,
        "HAS-KEY":  storage.hasKey,
        "PUT":      storage.setItem,
        "REMOVE":   storage.removeItem
      }
    }
}
