# Tortoise

info: https://github.com/NetLogo/NetLogo/wiki/NetLogo-Web

engine/compiler issues: https://github.com/NetLogo/Tortoise/issues

web server and client code and issues: https://github.com/NetLogo/Galapagos

## Libraries

The following lists the libraries used by Tortoise and the licenses that they are released under:

  * **Mori** [[source](https://github.com/swannodette/mori)] [[info](http://swannodette.github.io/mori/)] [[license](http://www.eclipse.org/legal/epl-v10.html)]

## Compiling

There are several sbt builds within the Tortoise project.
* `compilerJVM` builds the JVM compiler project, used for running some tests.
* `compilerJS` builds the Scala.js compiler project, which creates `tortoise-compiler.js` that can turn NetLogo models and code into javascript.
* `engine` builds the combination CoffeeScript and Scala.js engine project, creating `tortoise-engine.js`, which is required to actually run the result of compiling a NetLogo model to javascript.
* `netLogoWeb` contains a JVM project which runs an end-to-end tests against the artifacts of `compilerJS` and `engine`, using the Graal JS javascript runtime.  It also contains the task to publish the finished javascript as a package.
* `macrosJS/JVM` contain macros used by Tortoise in widget serialization/deserialization.

For more information see the [Tortoise architecture wiki page](https://github.com/NetLogo/Tortoise/wiki/Architecture)
