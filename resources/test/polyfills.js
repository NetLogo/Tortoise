if (typeof Polyglot !== "undefined") {

  const BAOS           = Java.type('java.io.ByteArrayOutputStream');
  const Base64         = Java.type('java.util.Base64');
  const Compiler       = Java.type('org.nlogo.tortoise.compiler.Compiler');
  const Files          = Java.type('java.nio.file.Files');
  const ImageIO        = Java.type('javax.imageio.ImageIO');
  const Paths          = Java.type('java.nio.file.Paths');
  const Scanner        = Java.type('java.util.Scanner');
  const URL            = Java.type('java.net.URL');

  const exportFile =
    function(str) {
      return function(filename) {
        Files.createDirectories(Paths.get(filename).getParent());
        Files.write(Paths.get(filename), Compiler.getBytes(str));
      };
    };

  const slurpBufferedImage =
    function(bImage, mimeStr) {

      const baos = new BAOS();
      ImageIO.write(bImage, mimeStr.slice(mimeStr.indexOf('/') + 1), baos);
      baos.close();

      byteStr = Base64.getEncoder().encodeToString(baos.toByteArray());
      return "data:" + mimeStr + ";base64," + byteStr;

    };

  const slurpByType =
    function(mimeStr, slurpText, slurpImage) {
      if (mimeStr == "content/unknown" || mimeStr.startsWith('text/') || mimeStr.startsWith('application/')) {
        return slurpText();
      } else if (mimeStr.startsWith('image/')) {
        return slurpImage();
      } else {
        throw new Error("Unslurpable content type: " + mimeStr);
      }
    };

  const slurpFilepathAsync =
    function(filename) {
      return function(callback) {
        const path       = Paths.get(filename);
        const mimeStr    = Files.probeContentType(path);
        const slurpImage = function() { return slurpImageFromFile(filename, mimeStr); };
        const slurpText  = function() { return slurpTextFromFile(filename); };
        const slurped    = slurpByType(mimeStr, slurpText, slurpImage);
        callback(slurped);
      };
    };

  const slurpImageFromFile =
    function(filename, mimeStr) {
      const path    = Paths.get(filename);
      return slurpBufferedImage(ImageIO.read(path.toFile()), mimeStr);
    };

  const slurpImageFromURL =
    function(url, mimeStr) {
      return slurpBufferedImage(ImageIO.read(url), mimeStr);
    };

  const slurpTextFromFile =
    function(filename) {
      const out  = [];
      const path = Paths.get(filename);
      Files.readAllLines(path).forEach(function(line) { out.push(line); });
      return out.join("\n");
    };

  const slurpTextFromURL =
    function(url) {
      return new Scanner(url.openStream()).useDelimiter("\\A").next();
    };

  const slurpURLSynchronously =
    function(url) {
      const jurl       = new URL(url);
      const mimeStr    = jurl.openConnection().getContentType();
      const slurpImage = function() { return slurpImageFromURL(jurl, mimeStr); };
      const slurpText  = function() { return slurpTextFromURL(jurl); };
      const slurped    = slurpByType(mimeStr, slurpText, slurpImage);
      return slurped;
    };

  const slurpURLAsync =
    function(url) {
      return function(callback) {
        const jurl       = new URL(url);
        const mimeStr    = jurl.openConnection().getContentType();
        const slurpImage = function() { return slurpImageFromURL(jurl, mimeStr); };
        const slurpText  = function() { return slurpTextFromURL(jurl); };
        const slurped    = slurpByType(mimeStr, slurpText, slurpImage);
        callback(slurped);
      };
    };

  const dialog =
    { confirm: function(str) { return true; }
    , input:   function(str) { return 'dummy implementation'; }
    , notify:  function(str) {}
    , yesOrNo: function(str) { return true; }
    }

  const importExport =
    { exportFile:     exportFile
    , exportOutput:   function(filename) {}
    , exportView:     function(filename) {}
    , importDrawing:  function(filename) { return function(callback) {}; }
    , importFile:     slurpFilepathAsync
    };

  const inspection =
    { clearDead:      function()      {}
    , inspect:        function(agent) {}
    , stopInspecting: function(agent) {}
    };

  const io =
    { slurpFilepathAsync: slurpFilepathAsync
    , slurpURL:           slurpURLSynchronously
    , slurpURLAsync:      slurpURLAsync
    };

  const output =
    { clear: function() {}
    , write: function() { return function(str) { context.getWriter().print(str); }; }
    };

  const world = { resizeWorld: function(agent) {} };

  global.modelConfig =
    { dialog:       dialog
    , importExport: importExport
    , inspection:   inspection
    , io:           io
    , output:       output
    , world:        world
    }

}
