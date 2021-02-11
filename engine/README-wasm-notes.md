# Moving to WASM

Current progress:

- [x] Move all js bundling to Webpack (only webpack really supports wasm right now)
- [x] Implement RNG in Rust
- [x] DockingFixture framework ready to rock and roll
    - [x] Fix Optimizations to mirror exact behavior in DockingFixture.scala
- [ ] Fix RNG implementation in Rust (needs to first pass `random.test.ts`) (some reference in the Rust src files)
- [ ] Use fast-check to mirror behavior in TestRandom.scala (prop testing)
- [ ] Port color model to Rust


This uses Rust and compiles it to wasm, and bundles everything together with `webpack`.

`grunt` and `grunt-coffeelint` are only here to pass the CI server. They do nothing.

Currently, RNG module still has incompatible internal state.

`plot.rs` module and `colormodel.rs` are work in progress, and they don't compile yet. Only `rng.rs` works right now, but the internal RNG state is still incompatible.

Currently the default setup will not include wasm in the final build. They only include original coffeescript files. To change this behavior, put `.ts` above `.coffee` in `resolve.extensions` of webpack.config.js.

# Testing

Tests are important! Only thorough testing can ensure that the new port is compatible with the old and most importantly, NetLogo Desktop.

They are written in TS and use the mocha framework. To run tests, type:

```
yarn test
```

## Test Organization

Test files are in `test`. They are only 1 level deep. Files in `common` are for imports. Given that the original test suite is only 1 level deep, I think we don't need more nesting.

## Test Dependencies

These are the notable npm (yarn) dependencies required for testing. They are declared in `package.json`.

- mocha
- chai
- node-java (for nodejs and java interop)
- ts-node (for running ts tests directly)
- vm2 (for creating a engine to run the JS model; though built-in node vm can be used)
- cross-env (for setting env vars in a cross-platform way, for mocha and ts-node to work together)

### Special requirements

`node-java` requires `node-gyp`, which has [special requirements](https://github.com/nodejs/node-gyp).

In particular, for windows, Python and Visual C++ Build Tools are required.

I had them installed already. But I had the 2019 version of the build tools, and it seems to not work with this.

But version 2017 worked. So before installing dependencies, makes sure to set environment variable:

```
npm config set msvs_version 2017
```

### Jar files

In addition, jars from the NetLogoWeb and Netlogo-headless-test are needed. They should be fat jars that include all dependencies, such as the scala standard library.

What I did was to use `sbt-assebmly` on the scala project, and assembled CompilerJVM. And then I downloaded netlogoheadless from bintry. Put them in `jars/`. Make sure `fixture.ts` is using the correct filenames for jars.



### More about test files

`engine.ts` exports the engine that runs NetLogo Web code during testing, with an interface similar to `GraalJS.scala`.

`fixture.ts` exports the `DockingFixture`.

`java.js` is setup for making experimenting in the nodejs repl more convenient.




2021-02-10 Ruoshui
