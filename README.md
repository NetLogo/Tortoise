# Tortoise

info: https://github.com/NetLogo/NetLogo/wiki/Tortoise

engine/compiler issues: https://github.com/NetLogo/Tortoise/issues

web server and client code and issues: https://github.com/NetLogo/Galapagos

## Libraries

The following lists the libraries used by Tortoise and the licenses that they are released under:

  * **lodash** [[source](https://github.com/lodash/lodash)] [[info](http://lodash.com/)] [[license](https://raw.githubusercontent.com/dojo/dojo/c84bf39e40acb310e63ebd7802ce3773b8525abb/LICENSE)]
  * **Mori** [[source](https://github.com/swannodette/mori)] [[info](http://swannodette.github.io/mori/)] [[license](http://www.eclipse.org/legal/epl-v10.html)]

## Compiling

There are several sbt builds within the Tortoise project.
* `tortoise` builds the JVM tortoise project.
* `tortoiseJs` build the scala.js tortoise project.
* `tortoiseJsTest` contains a JVM project which runs an end-to-end test against the artifact of `tortoiseJs`, using Rhino.
* `macros` contains macros used by Tortoise in widget serialization/deserialization.
