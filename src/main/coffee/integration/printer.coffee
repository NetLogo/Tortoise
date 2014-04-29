define(->
  if console? # V8
    console.log.bind(console) # If the console context doesn't get bound, the function fails on use --JAB (4/21/14)
  else if println?
    println
  else if print? # SpiderMonkey
    print
  else # Nashorn #@# Redundant
    java.lang.System.out.println
)
