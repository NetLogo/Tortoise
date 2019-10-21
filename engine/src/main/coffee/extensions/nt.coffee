# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {

  init: (workspace) ->

    ntStore = { }

    get = (key) ->
      if ntStore.hasOwnProperty(key)
        ntStore[key]
      else
        ""

    set = (key, value) ->
      ntStore[key] = value
      return

    { name: "nt", prims: { "GET": get, "SET": set } }

}
