#@# Links inherit `turtleBuiltins`, and `linkBuiltins` contain a bunch of crazy placeholder variables that don't actually mean anything --JAB (2/6/14)
define(-> {
  turtleBuiltins: ["id", "color", "heading", "xcor", "ycor", "shape", "label", "label-color", "breed", "hidden?", "size", "pen-size", "pen-mode"]
  patchBuiltins:  ["pxcor", "pycor", "pcolor", "plabel", "plabel-color"]
  linkBuiltins:   ["end1", "end2", "lcolor", "llabel", "llabelcolor", "lhidden", "lbreed", "thickness", "lshape", "tie-mode"]
  linkExtras:     ["color", "heading", "shape", "label", "label-color", "breed", "hidden?", "size", "midpointx", "midpointy"]
})
