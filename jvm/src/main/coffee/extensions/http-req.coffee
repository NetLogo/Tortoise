# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {

  dumper: undefined

  init: (workspace) ->

    # (String) => [String, String, String]
    get = (url) ->
      req = requestor("GET", url)
      [req.status, req.statusText, req.responseText ? '']

    # (String, String, String) => [String, String, String]
    post = (url, message, contentType) ->
      req = requestor("POST", url, message, contentType ? "text/plain")
      [req.status, req.statusText, req.responseText]

    # (String, String, String, String) => XMLHttpRequest
    requestor = (reqType, url, message, contentType) ->
      req = new XMLHttpRequest()

      # Setting the async option to `false` is deprecated and "bad" as far as HTML/JS is
      # concerned.  But this is NetLogo and NetLogo model code doesn't have a concept of
      # async execution, so this is the best we can do.  As long as it isn't used on a
      # per-tick basis or in a loop, it should be okay.  -JMB August 2017
      req.open(reqType, url, false)

      if contentType?
        ct = switch contentType
          when 'json'
            'application/json'
          when 'urlencoded'
            'application/x-www-form-urlencoded'
          else
            contentType
        req.setRequestHeader("Content-type", ct)

      req.send(message ? "")
      req

    {
      name: "http-req"
    , prims: {
        "GET":  get
      , "POST": post
      }
    }

}
