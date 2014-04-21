#@# Links inherit `turtleBuiltins`, and `linkBuiltins` contain a bunch of crazy placeholder variables that don't actually mean anything --JAB (2/6/14)
define(-> {
  turtleBuiltins: ["id", "color", "heading", "xcor", "ycor", "shape", "label", "labelcolor", "breed", "hidden", "size", "pensize", "penmode"]
  patchBuiltins:  ["pxcor", "pycor", "pcolor", "plabel", "plabelcolor"]
  linkBuiltins:   ["end1", "end2", "lcolor", "llabel", "llabelcolor", "lhidden", "lbreed", "thickness", "lshape", "tiemode"]
  linkExtras:     ["size", "heading", "midpointx", "midpointy"]
})
