#@# Just make this a function that calls Lodash's `cloneDeep`
define(-> {
  clone: (obj) ->
    return obj if obj is null or typeof (obj) isnt "object"
    temp = new obj.constructor()
    for key in Object.getOwnPropertyNames(obj)
      temp[key] = @clone(obj[key])
    temp
})
