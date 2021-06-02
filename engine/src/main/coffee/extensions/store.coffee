# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

class ObjectStorage
  constructor: () ->
    @store = { name : "", data: {} }
    @stores = []
    @stores.push( @store )

  # ((String[]) => Unit) => Unit
  listStores: (callback) =>
    callback(@stores.filter( (store) -> store.name isnt "" ).map( (store) -> store.name ))
    return

  # (String) => Unit
  switchStore: (name) =>
    name = if (name isnt "Default Store") then name else ""
    matchingStore = @stores.find( (store) -> store.name is name )
    @store = if (matchingStore?) then matchingStore else
      store = { name: name, data: {} }
      @stores.push( store )
      store
    return

  # (String) => Unit
  deleteStore: (name) =>
    if (name is "" or name is "Default Store")
      throw exceptions.extension("Cannot delete the default store, but you can clear it if you want.")

    if (@store.name is name)
      throw exceptions.extension("Cannot delete the current store, switch to another store first.")

    @stores = @stores.filter( (store) -> store.name isnt name )
    return

  # (String, (String) => Unit) => Unit
  getItem: (key, callback) =>
    @hasKey(key, (isValidKey) =>
      if (not isValidKey)
        throw exceptions.extension("Could not find a value for key: '#{key}'.")
      callback(@store.data[key])
    )
    return

  # (String, String, () => Unit) => Unit
  setItem: (key, value, callback = (->)) =>
    @store.data[key] = value
    callback()
    return

  # (String, () => Unit) => Unit
  removeItem: (key, callback = (->)) =>
    @hasKey(key, (isValidKey) =>
      if (isValidKey)
        delete @store.data[key]
    )
    callback()
    return

  # (String, (Boolean) => Unit) => Unit
  hasKey: (key, callback) =>
    callback(@store.data.hasOwnProperty(key))
    return

  # ((String[]) => Unit) => Unit
  getKeys: (callback) =>
    callback(Object.getOwnPropertyNames(@store.data))
    return

  # (() => Unit) => Unit
  clear: (callback = (->)) =>
    @store.data = {}
    callback()
    return

class ForageStorage
  constructor: (@localforage, reportErrors) ->

    @reportError = (error) ->
      reportErrors(["Unable to process your store request.", "", error.message])

    @_setCurrentStorage("Default Store", "default")

    @storesInstance = @localforage.createInstance({
      name:      "Store Extension for NLW",
      storeName: "nlw_store_extension_stores"
    })

    @stores = []

    @lastStoreNumber = 0
    @storesInstance.iterate( (storeNumber, name) =>
      storeName = @_storeName(storeNumber)
      @stores.push( { name, storeName, storeNumber } )
      if (storeNumber > @lastStoreNumber)
        @lastStoreNumber = storeNumber
    )

    return

  _storeName: (storeNumber) ->
    "nlw_store_extension_#{storeNumber}"

  # (String, Int | String) => Unit
  _setCurrentStorage: (name, storeNumber) =>
    store = {
      name: name
      storeName: @_storeName(storeNumber)
      storeNumber: storeNumber
    }
    @currentStorage = @localforage.createInstance(store)
    return store

  # ((String[]) => Unit) => Unit
  listStores: (callback) =>
    callback( @stores.filter( (store) -> store.name isnt "" ).map( (store) -> store.name ) )
    return

  # (String) => Unit
  switchStore: (name) =>
    if (name is "" or name is "Default Store")
      @_setCurrentStorage("Default Store", "default")
      return

    matchingStore = @stores.find( (store) -> store.name is name )

    if (matchingStore?)
      @_setCurrentStorage(matchingStore.name, matchingStore.storeNumber)
    else
      @lastStoreNumber = @lastStoreNumber + 1
      @storesInstance.setItem(name, @lastStoreNumber)
      @stores.push(@_setCurrentStorage(name, @lastStoreNumber))

    return

  # (String) => Unit
  deleteStore: (name) =>
    if (name is "" or name is "Default Store")
      throw exceptions.extension("Cannot delete the default store, but you can clear it if you want.")

    if (@currentStorage._config.name is name)
      throw exceptions.extension("Cannot delete the current store, switch to another store first.")

    @storesInstance.removeItem(name)

    store = @stores.find( (store) -> store.name is name)
    if (not store?)
      return

    deleteStore = @localforage.createInstance({
      name: name
      storeName: store.storeName
    })
    deleteStore.dropInstance()

    @stores = @stores.filter( (store) -> store.name isnt name )

    return

  # (String, (String) => Unit) => Unit
  getItem: (key, callback) =>
    @hasKey(key, (isValidKey) =>
      if (not isValidKey)
        throw exceptions.extension("Could not find a value for key: '#{key}'.")
      @currentStorage.getItem(key)
        .then(callback)
        .catch(@reportError)
    )
    return

  # ((String[]) => Unit) => Unit
  getKeys: (callback) =>
    @currentStorage.keys()
      .then(callback)
      .catch(@reportError)
    return

  # (String, (Boolean) => Unit) => Unit
  hasKey: (key, callback) =>
    @getKeys((keys) ->
      callback(keys.includes(key))
    )
    return

  # (String, String, () => Unit) => Unit
  setItem: (key, value, callback = (->)) =>
    @currentStorage.setItem(key, value)
      .then(callback)
      .catch(@reportError)
    return

  # (String, () => Unit) => Unit
  removeItem: (key, callback = (->)) =>
    @currentStorage.removeItem(key)
      .then(callback)
      .catch(@reportError)
    return

  # (() => Unit) => Unit
  clear: (callback = (->)) =>
    @currentStorage.clear()
      .then(callback)
      .catch(@reportError)
    return

module.exports = {

  init: (workspace) ->
    storage = if (window?.localforage?) then new ForageStorage(window.localforage, workspace.reportErrors) else new ObjectStorage()

    {
      name: "store"
    , prims: {
        "LIST-STORES":  storage.listStores,
        "SWITCH-STORE": storage.switchStore,
        "DELETE-STORE": storage.deleteStore,
        "CLEAR":        storage.clear,
        "GET":          storage.getItem,
        "GET-KEYS":     storage.getKeys,
        "HAS-KEY":      storage.hasKey,
        "PUT":          storage.setItem,
        "REMOVE":       storage.removeItem,
      }
    }
}
