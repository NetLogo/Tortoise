// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

/*
  `Workspace` is needed to do anything.  If you want the core of Tortoise, do `import 'engine/workspace'`.
  If you want the peripheral stuff (i.e. because you're a compiler or test infrastructure),
  the other things you might want ought to get initialized by Webpack here. --JAB (5/7/14) --Ruoshui (1/13/21)
*/

import './agentmodel';
import './engine/workspace';
import './engine/prim/prims';
import './engine/prim/tasks';
import './extensions/all';
import './util/notimplemented';

// $ rg tortoise_require . > req.txt

// expose these with expose-loader
// $ perl -pe "s/.*(tortoise_require\(\'.*?\'\)).*/\1/" req.txt | sort | uniq -c

//       1 compiler\shared\src\main\scala\RuntimeInit.scala:    s"""tortoise_require("extensions/all").porters($porters)"""
//       1 engine\Gruntfile.coffee:      grunt.file.write(filepath, "tortoise_require#{strContents.substr(9)}")
//       1 engine\Gruntfile.coffee:    'Changes "require" varname to "tortoise_require"'
//       2 tortoise_require('$filePath')
//      91 tortoise_require('agentmodel')
//       1 tortoise_require('brazier/maybe')
//      90 tortoise_require('engine/core/colormodel')
//      90 tortoise_require('engine/core/link')
//      90 tortoise_require('engine/core/linkset')
//      90 tortoise_require('engine/core/patchset')
//      90 tortoise_require('engine/core/turtle')
//      90 tortoise_require('engine/core/turtleset')
//      90 tortoise_require('engine/core/typechecker')
//      91 tortoise_require('engine/plot/pen')
//      90 tortoise_require('engine/plot/plot')
//      91 tortoise_require('engine/plot/plotops')
//      90 tortoise_require('engine/prim/tasks')
//      93 tortoise_require('engine/workspace')
//      90 tortoise_require('extensions/all')
//      90 tortoise_require('meta')
//       2 tortoise_require('shim/engine-scala')
//      90 tortoise_require('shim/random')
//      91 tortoise_require('shim/strictmath')
//      90 tortoise_require('util/errors')
//      90 tortoise_require('util/exception')
//      90 tortoise_require('util/nlmath')
//      90 tortoise_require('util/notimplemented')

//
// $ perl -pe "s/.*(tortoise_require\(\'.*?\'\)).*/\1/" req.txt | sort | uniq | perl -pe 's/tortoise_require\(\'"'"'(.*?)\'"'"'\).*/import "expose-loader?exposes[]=tortoise.\1\!.\/\1"/'
import 'expose-loader?exposes[]=tortoise.agentmodel!./agentmodel';
import 'expose-loader?exposes[]=tortoise.agentmodel!./agentmodel';
import 'expose-loader?exposes[]=tortoise.brazier/maybe!brazier/maybe';
import 'expose-loader?exposes[]=tortoise.engine/core/colormodel!./engine/core/colormodel';
import 'expose-loader?exposes[]=tortoise.engine/core/link!./engine/core/link';
import 'expose-loader?exposes[]=tortoise.engine/core/linkset!./engine/core/linkset';
import 'expose-loader?exposes[]=tortoise.engine/core/patchset!./engine/core/patchset';
import 'expose-loader?exposes[]=tortoise.engine/core/turtle!./engine/core/turtle';
import 'expose-loader?exposes[]=tortoise.engine/core/turtleset!./engine/core/turtleset';
import 'expose-loader?exposes[]=tortoise.engine/core/typechecker!./engine/core/typechecker';
import 'expose-loader?exposes[]=tortoise.engine/plot/pen!./engine/plot/pen';
import 'expose-loader?exposes[]=tortoise.engine/plot/plot!./engine/plot/plot';
import 'expose-loader?exposes[]=tortoise.engine/plot/plotops!./engine/plot/plotops';
import 'expose-loader?exposes[]=tortoise.engine/prim/tasks!./engine/prim/tasks';
import 'expose-loader?exposes[]=tortoise.engine/workspace!./engine/workspace';
import 'expose-loader?exposes[]=tortoise.extensions/all!./extensions/all';
import 'expose-loader?exposes[]=tortoise.meta!./meta';
import 'expose-loader?exposes[]=tortoise.shim/engine-scala!./shim/engine-scala';
import 'expose-loader?exposes[]=tortoise.shim/random!./shim/random';
import 'expose-loader?exposes[]=tortoise.shim/strictmath!./shim/strictmath';
import 'expose-loader?exposes[]=tortoise.util/errors!./util/errors';
import 'expose-loader?exposes[]=tortoise.util/exception!./util/exception';
import 'expose-loader?exposes[]=tortoise.util/nlmath!./util/nlmath';
import 'expose-loader?exposes[]=tortoise.util/notimplemented!./util/notimplemented';

// Things on globalThis needs to be copied somewhere else so they don't get overwritten during/before testing.
const tortoise_mods = { ...globalThis.tortoise };

globalThis.tortoise_require = (mod) => tortoise_mods[mod];
