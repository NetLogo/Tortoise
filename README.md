# Tortoise

NetLogo Web is a JavaScript implementation of the NetLogo programming language and simulation environment.  It runs entirely in a web browser, no plugins or installs required.  Run it now at [netlogoweb.org](https://netlogoweb.org) or get more information at [netlogo.org](https://netlogo.org).

If you're encountering an error with NetLogo Web:

- For reporting issues with the NetLogo Web engine or compiler: https://github.com/NetLogo/Tortoise/issues
- For reporting issues with the NetLogo Web site and UI: https://github.com/NetLogo/Galapagos/issues
- If you're not sure, go with Galapagos and we'll move the issue if necessary.

See [CONTRIBUTING.md](CONTRIBUTING.md) for build setup, testing, and contributing guidelines.

## Libraries

The following lists the JavaScript runtime libraries used by Tortoise and the licenses they are released under:

  * **Mori** [[source](https://github.com/swannodette/mori)] [[info](http://swannodette.github.io/mori/)] [[license](http://www.eclipse.org/legal/epl-v10.html)]
  * **BrazierJS** [[source](https://github.com/NetLogo/brazier)]
  * **crypto-js** [[source](https://github.com/brix/crypto-js)] [[license](https://opensource.org/licenses/MIT)]
  * **csv-parse** [[source](https://github.com/adaltas/node-csv)] [[license](https://opensource.org/licenses/MIT)]
  * **iframe-phone** [[source](https://github.com/concord-consortium/iframe-phone)] [[license](https://opensource.org/licenses/MIT)]
  * **Tone.js** [[source](https://github.com/Tonejs/Tone.js)] [[license](https://opensource.org/licenses/MIT)]
  * **vectorious** [[source](https://github.com/mateogianolio/vectorious)] [[license](https://opensource.org/licenses/MIT)]

Key Scala libraries include **scalaz**, **play-json**, and **Scala.js**.

## Requirements

Tortoise requires **GraalVM CE 25** (Java 25). The recommended way to install it is via **[SDKMAN!](https://sdkman.io/)**.  The `sbt.sh` script will automatically activate the correct GraalVM version via SDKMAN! if it is installed.  The `./sbt.sh` wrapper also pins the Node.js binary to avoid conflicts with GraalVM's bundled node.  Use it instead of invoking `sbt` directly to avoid any oddities.

## Compiling

There are several sbt builds within the Tortoise project. Run them via `./sbt.sh`:

* `compilerJVM` builds the JVM compiler project, used for running some tests.
* `compilerJS` builds the Scala.js compiler project, which creates `tortoise-compiler.js` that can turn NetLogo models and code into javascript.
* `engine` builds the combination CoffeeScript and Scala.js engine project, creating `tortoise-engine.js`, which is required to actually run the result of compiling a NetLogo model to javascript.
* `netLogoWeb` contains a JVM project which runs end-to-end tests against the artifacts of `compilerJS` and `engine`, using the Graal JS javascript runtime.  It also contains the task to publish the finished JavaScript compiler and engine artifacts as a package.
* `macrosJS/JVM` contain macros used by Tortoise in widget serialization/deserialization.

For more information see the [Tortoise architecture wiki page](https://github.com/NetLogo/Tortoise/wiki/Architecture)

[![Hosted By: Cloudsmith](https://img.shields.io/badge/OSS%20hosting%20by-cloudsmith-blue?logo=cloudsmith&style=flat-square)](https://cloudsmith.com)

Package repository hosting is graciously provided by [Cloudsmith](https://cloudsmith.com).
