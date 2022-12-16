if (typeof Polyglot !== "undefined") {

  const Maybe = tortoise_require('brazier/maybe');

  const BAIS     = Java.type('java.io.ByteArrayInputStream');
  const BAOS     = Java.type('java.io.ByteArrayOutputStream');
  const Base64   = Java.type('java.util.Base64');
  const ByteArr  = Java.type("byte[]");
  const Color    = Java.type('java.awt.Color');
  const Compiler = Java.type('org.nlogo.tortoise.compiler.Polyfills');
  const Files    = Java.type('java.nio.file.Files');
  const ImageIO  = Java.type('javax.imageio.ImageIO');
  const Paths    = Java.type('java.nio.file.Paths');
  const Scanner  = Java.type('java.util.Scanner');
  const URL      = Java.type('java.net.URL');

  const File          = Java.type('java.io.File');
  const BufferedImage = Java.type('java.awt.image.BufferedImage');

  const base64ToImageData =
    function(base64) {
      const splits  = base64.split(',');
      if (splits.length != 2) {
        throw new Error(`splits not 2: ${splits.length}, ${base64.substring(0, 40)}...`)
      }
      const trimmed = splits[1];
      const bytes   = Base64.getDecoder().decode(trimmed);
      const bais    = new BAIS(bytes);
      const image   = ImageIO.read(bais);
      if (image === null) {
        throw new Error(`image was null?: ${bytes.length}, ${base64.substring(0, 40)}...`)
      }
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

  const imageDataToBufferedImage =
    function(imageData) {
      const image = new BufferedImage(imageData.width, imageData.height, BufferedImage.TYPE_3BYTE_BGR)
      for (var i = 0; i < imageData.data.length; i += 4) {
        const color = ((imageData.data[i] & 0xFF) << 16) + ((imageData.data[i + 1] & 0xFF) << 8) + ((imageData.data[i + 2] & 0xFF))
        const pixelIndex = i / 4
        image.setRGB((pixelIndex % imageData.width), Math.floor(pixelIndex / imageData.width), color)
      }
      return image
    }

  const imageDataToBase64 =
    function(imageData) {
      const output = new BAOS();
      const image  = imageDataToBufferedImage(imageData)
      ImageIO.write(image, "png", output);
      const base64 = Base64.getEncoder().encodeToString(output.toByteArray());
      return `data:image/png;base64,${base64}`;
    }

  const exportFile =
    function(str) {
      return function(filename) {
        const path   = Paths.get(filename);
        const parent = path.getParent();
        if (parent !== null) {
          Files.createDirectories(parent);
        }
        Files.write(path, Compiler.getBytes(str));
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
    , notify:  function(str) { console.log(str); }
    , yesOrNo: function(str) { return true; }
    }

  let outputBuffer = ""

  const importExport =
    { exportFile:    exportFile
    , getNlogo:      function() { return ""; }
    , getOutput:     function() { return outputBuffer; }
    , getViewBase64: function() { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="; }
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

  // This was created to help during development of the Bitmap extension for NetLogo Web.  I'm going to leave it here in
  // case it is useful for future debugging of that or anything else.  -Jeremy B November 2022
  global.writeImage = function(name, imageData) {
    const image = imageDataToBufferedImage(imageData)
    ImageIO.write(image, "png", new File(name));
  }

  global.atob = function(base64) {
    let bytes = Base64.getDecoder().decode(base64);
    return String.fromCharCode(...bytes);
  }

  global.btoa = function(str) {
    return Base64.getEncoder().encodeToString(Compiler.getBytes(str));
  }

  global.crypto = {
    // only works for int32 values, just for testing, please don't ever let this into the wild.  -Jeremy B September
    // 2022
    getRandomValues: (arr) => {
      arr.forEach( (_, i) => {
        const thirtyTwoLimit = 2 ** 31
        arr[i] = Math.floor(thirtyTwoLimit * 2 * Math.random() - thirtyTwoLimit)
      })
      return arr
    }
  }

  global.TextDecoder = class {
    decode(bytes) {

      // http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

      /* utf.js - UTF-8 <=> UTF-16 convertion
       *
       * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
       * Version: 1.0
       * This library is free.  You can redistribute it and/or modify it.
       */

      let out = "";
      let i   = 0;

      while (i < bytes.length) {

        const char1 = bytes[i++];

        switch (char1 >> 4) {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
            // 0xxxxxxx
            out += String.fromCharCode(char1);
            break;
          }
          case 12: case 13: {
            // 110x xxxx   10xx xxxx
            const char2 = bytes[i++];
            const code  = ((char1 & 0x1F) << 6) |
                          ((char2 & 0x3F) << 0)
            out += String.fromCharCode(code);
            break;
          }
          case 14: {
            // 1110 xxxx  10xx xxxx  10xx xxxx
            const char2 = bytes[i++];
            const char3 = bytes[i++];
            const code  = ((char1 & 0x0F) << 12) |
                          ((char2 & 0x3F) <<  6) |
                          ((char3 & 0x3F) <<  0)
            out += String.fromCharCode(code);
            break;
          }
        }

      }

      return out;

    }
  }

  global.TextEncoder = class {
    encode(str) {

      // Java does signed bytes, but we want unsigned bytes. --Jason B. (3/16/22)
      const jBytes = Compiler.getBytes(str);

      const out = [];

      for (let i = 0; i < jBytes.length; i++) {
        out[i] = jBytes[i] & 0xFF;
      }

      return out;

    }
  }

  global.modelConfig =
    { asyncDialog:       asyncDialog
    , base64ToImageData: base64ToImageData
    , imageDataToBase64: imageDataToBase64
    , dialog:            dialog
    , importExport:      importExport
    , importImage:       () => {}
    , inspection:        inspection
    , io:                io
    , output:            output
    , world:             world
    }

}
