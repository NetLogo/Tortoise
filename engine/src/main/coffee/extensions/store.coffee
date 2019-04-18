# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class ObjectStorage
  constructor: () ->
    @storage = {}

  # (String, (String) => Unit) => Unit
  getItem: (key, callback) =>
    @hasKey(key, (isValidKey) =>
      if (not isValidKey)
        throw new Error("Extension exception: Could not find a value for key: '#{key}'.")
      callback(@storage[key])
    )
    return

  # (String, String, () => Unit) => Unit
  setItem: (key, value, callback = (->)) =>
    @storage[key] = value
    callback()
    return

  # (String, () => Unit) => Unit
  removeItem: (key, callback = (->)) =>
    @hasKey(key, (isValidKey) =>
      if (isValidKey)
        delete @storage[key]
    )
    callback()
    return

  # (String, (Boolean) => Unit) => Unit
  hasKey: (key, callback) =>
    callback(@storage.hasOwnProperty(key))
    return

  # ((String[]) => Unit) => Unit
  getKeys: (callback) =>
    callback(Object.getOwnPropertyNames(@storage))
    return

  # (() => Unit) => Unit
  clear: (callback = (->)) =>
    @storage = {}
    callback()
    return

class ForageStorage
  constructor: (localforage) ->
    @localforage = localforage
    @localforage.config({
      name:      "Store Extension for NLW",
      storeName: "nlw_store_extension"
    })
    return

  # (String, (String) => Unit) => Unit
  getItem: (key, callback) =>
    @hasKey(key, (isValidKey) =>
      if (not isValidKey)
        throw new Error("Extension exception: Could not find a value for key: '#{key}'.")
      @localforage.getItem(key, (e, value) -> callback(value))
    )
    return

  # ((String[]) => Unit) => Unit
  getKeys: (callback) =>
    @localforage.keys((e, keys) => callback(keys))
    return

  # (String, (Boolean) => Unit) => Unit
  hasKey: (key, callback) =>
    @getKeys((keys) ->
      callback(keys.includes(key))
    )
    return

  # (String, String, () => Unit) => Unit
  setItem: (key, value, callback = (->)) =>
    @localforage.setItem(key, value, callback)
    return

  # (String, () => Unit) => Unit
  removeItem: (key, callback = (->)) =>
    @localforage.removeItem(key, callback)
    return

  # (() => Unit) => Unit
  clear: (callback = (->)) =>
    @localforage.clear(callback)
    return

module.exports = {

  init: (workspace) ->
    storage = if (window?.localforage?) then new ForageStorage(window.localforage) else new ObjectStorage()

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
