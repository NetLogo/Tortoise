# Nashorn calls it "print", V8 and browsers have "console.log".
# get it somehow!
define(->
  if println?
    println
  else if console? #8
    console.log
  else if print? # SpiderMonkey
    print
  else # Nashorn #@# Redundant
    java.lang.System.out.println
)
