if (typeof Polyglot !== "undefined") {

  const Maybe = tortoise_require('brazier/maybe');

  const BAIS     = Java.type('java.io.ByteArrayInputStream');
  const BAOS     = Java.type('java.io.ByteArrayOutputStream');
  const Base64   = Java.type('java.util.Base64');
  const ByteArr  = Java.type("byte[]");
  const Color    = Java.type('java.awt.Color');
  const Compiler = Java.type('org.nlogo.tortoise.compiler.Compiler');
  const Files    = Java.type('java.nio.file.Files');
  const ImageIO  = Java.type('javax.imageio.ImageIO');
  const Paths    = Java.type('java.nio.file.Paths');
  const Scanner  = Java.type('java.util.Scanner');
  const URL      = Java.type('java.net.URL');

  const base64ToImageData =
    function(base64) {

      const trimmed = base64.split(',')[1];
      const bytes   = Base64.getDecoder().decode(trimmed);
      const bais    = new BAIS(bytes);
      const image   = ImageIO.read(bais);
      bais.close();

      const output = [];
      for (let y = 0; y < image.getHeight(); y++) {
        for (let x = 0; x < image.getWidth(); x++) {
          const pixel = new Color(image.getRGB(x, y), true);
          output.push(pixel.getRed());
          output.push(pixel.getGreen());
          output.push(pixel.getBlue());
          output.push(pixel.getAlpha());
        }
      }

      return { data: output, height: image.getHeight(), width: image.getWidth() };

    }

  const exportFile =
    function(str) {
      return function(filename) {
        Files.createDirectories(Paths.get(filename).getParent());
        Files.write(Paths.get(filename), Compiler.getBytes(str));
      };
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

  const slurpFileDialogAsync =
    function(callback) {
      throw new Error("You can't get user input headlessly.");
    };

  const slurpFilepathAsync =
    function(filename) {
      return function(callback) {
        const path       = Paths.get(filename);
        const mimeStr    = path.toUri().toURL().openConnection().getContentType();
        const slurpImage = function() { return slurpImageFromFile(filename, mimeStr); };
        const slurpText  = function() { return slurpTextFromFile(filename); };
        const slurped    = slurpByType(mimeStr, slurpText, slurpImage);
        callback(slurped);
      };
    };

  const slurpImageFromFile =
    function(filename, mimeStr) {
      const path    = Paths.get(filename);
      const bytes   = Files.readAllBytes(path);
      const byteStr = Base64.getEncoder().encodeToString(bytes);
      return "data:" + mimeStr + ";base64," + byteStr;
    };

  const slurpImageFromURL =
    function(url, mimeStr) {

      const baos    = new BAOS();
      const stream  = url.openStream();
      const buffer  = new ByteArr(1024);
      var   n       = 0;

      while ((n = stream.read(buffer)) > 0) {
        baos.write(buffer, 0, n);
      }

      stream.close();

      const byteStr = Base64.getEncoder().encodeToString(baos.toByteArray());
      return "data:" + mimeStr + ";base64," + byteStr;

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

  const asyncDialog =
    { getChoice:   function(message, choices) { return function() { return Maybe.None; }; }
    , getText:     function(message)          { return function() { return Maybe.None; }; }
    , getYesOrNo:  function(message)          { return function() { return Maybe.None; }; }
    , showMessage: function(message)          { return function() { return Maybe.None; }; }
    }

  const dialog =
    { confirm: function(str) { return true; }
    , input:   function(str) { return 'dummy implementation'; }
    , notify:  function(str) {}
    , yesOrNo: function(str) { return true; }
    }

  let outputBuffer = ""

  const importExport =
    { exportFile:    exportFile
    , getNlogo:      function() { return ""; }
    , getOutput:     function() { return outputBuffer; }
    , getViewBase64: function() { return "data:image/jpeg;base64,/9j/fake64"; }
    , importFile:    slurpFilepathAsync
    };

  const inspection =
    { clearDead:      function()      {}
    , inspect:        function(agent) {}
    , stopInspecting: function(agent) {}
    };

  const io =
    { importFile:           slurpFilepathAsync
    , slurpFileDialogAsync: slurpFileDialogAsync
    , slurpURL:             slurpURLSynchronously
    , slurpURLAsync:        slurpURLAsync
    };

  const output =
    { clear: function() { outputBuffer = ""; }
    , write: function(str) { outputBuffer += str; }
    };

  const world = { resizeWorld: function(agent) {} };

  global.atob = function(base64) {
    let bytes = Base64.getDecoder().decode(base64);
    return String.fromCharCode(...bytes);
  }

  global.btoa = function(str) {
    return Base64.getEncoder().encodeToString(Compiler.getBytes(str));
  }

  global.modelConfig =
    { asyncDialog:       asyncDialog
    , base64ToImageData: base64ToImageData
    , dialog:            dialog
    , importExport:      importExport
    , inspection:        inspection
    , io:                io
    , output:            output
    , world:             world
    }

}
