# Tortoise

info: https://github.com/NetLogo/NetLogo/wiki/Tortoise

engine/compiler issues: https://github.com/NetLogo/Tortoise/issues

web server and client code and issues: https://github.com/NetLogo/Galapagos

## Libraries

The following lists the libraries used by Tortoise and the licenses that they are released under:

  * **lodash** [[source](https://github.com/lodash/lodash)] [[info](http://lodash.com/)] [[license](https://raw.githubusercontent.com/dojo/dojo/c84bf39e40acb310e63ebd7802ce3773b8525abb/LICENSE)]
  * **Mori** [[source](https://github.com/swannodette/mori)] [[info](http://swannodette.github.io/mori/)] [[license](http://www.eclipse.org/legal/epl-v10.html)]

## New Build Instructions

To build the RequireJS version, as before, run `grunt`.

To build the Closure Compiler version, run `grunt catchup`.

## Getting Started

So you maybe sorta kinda wanna see if you can build a part of Tortoise in Clojurescript.

Cool. There are, for now, three steps. (boo!)

BUT: they’re pretty easy. (hooray?)

  1 Do the dependency dance. (`npm install && lein deps`, probably, at the minimum)
  2 Run `grunt catchup` to compile a ClosureCompiler compatible build of the Tortoise source (which lives in `src/main/coffee`).
  3 Write up the .clj and .cljs files you want, put them in `src/main/cljs`, and run `grunt replace-all` to replace the corresponding files in the existing engine (namespaces must match - e.g., you want to replace `engine/core/structure/idmanager` with your cljs version? The cljs `ns` declaration to look like `(ns engine.core.structure.idmanager)`.)

#### Other useful stuff:

If you want to replace only one file, look at `grunt replace`. It takes two parameters, of the form: `--file=”namespace/subns/subns/filename.js” --to=”/namespace/subns/subns/filename-cl.js”`. For example, `grunt replace --file=”engine/core/structure/builtins.js” --to=”engine/core/structure/builtins-cl.js”`.

If you want `grunt` to keep up with your changes as you work on your clojurescript build, run `grunt cljs-compile/auto`.

(***Note***: `grunt cljs-compile/auto` doesn’t replace files for you once they’re compiled. However, running `grunt replace` or `grunt replace-all` will automatically compile your cljs.)

Every time grunt compiles your clojurescript sources, it also compiles a bundled up, standalone .js file containing just your clojurescript engine. This goes to `target/classes/js/tortoise-engine-cljs.js`.
It does something similar every time it compiles a ClosureCompiler or RequireJS version of the Tortoise source.

If you want to load up RequireJS Tortoise in a browser, load `file://path/to/project/root/client/strapper.html`.
If you want to load up ClosureCompiler Tortoise in a browser, load `file://path/to/project/root/client/strapper-cl.html`. Then, from the browser console. run `loadTortoise()`.
And if you want to load up the standalone cljs written so far, either run a leiningen server (`lein trampoline cljsbuild repl-launch chromium` -- only works for chromium) or direct your browser to `path/to/project/root/index.html` (or just `path/to/project/root`).
