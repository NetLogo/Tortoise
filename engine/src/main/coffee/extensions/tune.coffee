# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

getMIDI = () =>
  if window?.MIDI?
    return window.MIDI.Instance
  else
    return null

module.exports = {
  init: (workspace) ->
    allDrums = ["ACOUSTIC BASS DRUM", "BASS DRUM 1", "SIDE STICK", "ACOUSTIC SNARE", "HAND CLAP", "ELECTRIC SNARE", "LOW FLOOR TOM", "CLOSED HI HAT", "HI FLOOR TOM", "PEDAL HI HAT", "LOW TOM", "OPEN HI HAT", "LOW MID TOM", "HI MID TOM", "CRASH CYMBAL 1", "HI TOM", "RIDE CYMBAL 1", "CHINESE CYMBAL", "RIDE BELL", "TAMBOURINE", "SPLASH CYMBAL", "COWBELL", "CRASH CYMBAL 2", "VIBRASLAP", "RIDE CYMBAL 2", "HI BONGO", "LOW BONGO", "MUTE HI CONGA", "OPEN HI CONGA", "LOW CONGA", "HI TIMBALE", "LOW TIMBALE", "HI AGOGO", "LOW AGOGO", "CABASA", "MARACAS", "SHORT WHISTLE", "LONG WHISTLE", "SHORT GUIRO", "LONG GUIRO", "CLAVES", "HI WOOD BLOCK", "LOW WOOD BLOCK", "MUTE CUICA", "OPEN CUICA", "MUTE TRIANGLE", "OPEN TRIANGLE"]
    allInstruments = ["ACOUSTIC GRAND PIANO", "BRIGHT ACOUSTIC PIANO", "ELECTRIC GRAND PIANO", "HONKY-TONK PIANO", "ELECTRIC PIANO 1", "ELECTRIC PIANO 2", "HARPSICHORD", "CLAVI", "CELESTA", "GLOCKENSPIEL", "MUSIC BOX", "VIBRAPHONE", "MARIMBA", "XYLOPHONE", "TUBULAR BELLS", "DULCIMER", "DRAWBAR ORGAN", "PERCUSSIVE ORGAN", "ROCK ORGAN", "CHURCH ORGAN", "REED ORGAN", "ACCORDION", "HARMONICA", "TANGO ACCORDION", "NYLON STRING GUITAR", "STEEL ACOUSTIC GUITAR", "JAZZ ELECTRIC GUITAR", "CLEAN ELECTRIC GUITAR", "MUTED ELECTRIC GUITAR", "OVERDRIVEN GUITAR", "DISTORTION GUITAR", "GUITAR HARMONICS", "ACOUSTIC BASS", "FINGERED ELECTRIC BASS", "PICKED ELECTRIC BASS", "FRETLESS BASS", "SLAP BASS 1", "SLAP BASS 2", "SYNTH BASS 1", "SYNTH BASS 2", "VIOLIN", "VIOLA", "CELLO", "CONTRABASS", "TREMOLO STRINGS", "PIZZICATO STRINGS", "ORCHESTRAL HARP", "TIMPANI", "STRING ENSEMBLE 1", "STRING ENSEMBLE 2", "SYNTH STRINGS 1", "SYNTH STRINGS 2", "CHOIR AAHS", "VOICE OOHS", "SYNTH VOICE", "ORCHESTRA HIT", "TRUMPET", "TROMBONE", "TUBA", "MUTED TRUMPET", "FRENCH HORN", "BRASS SECTION", "SYNTH BRASS 1", "SYNTH BRASS 2", "SOPRANO SAX", "ALTO SAX", "TENOR SAX", "BARITONE SAX", "OBOE", "ENGLISH HORN", "BASSOON", "CLARINET", "PICCOLO", "FLUTE", "RECORDER", "PAN FLUTE", "BLOWN BOTTLE", "SHAKUHACHI", "WHISTLE", "OCARINA", "SQUARE WAVE", "SAWTOOTH WAVE", "CALLIOPE", "CHIFF", "CHARANG", "VOICE", "FIFTHS", "BASS AND LEAD", "NEW AGE", "WARM", "POLYSYNTH", "CHOIR", "BOWED", "METAL", "HALO", "SWEEP", "RAIN", "SOUNDTRACK", "CRYSTAL", "ATMOSPHERE", "BRIGHTNESS", "GOBLINS", "ECHOES", "SCI-FI", "SITAR", "BANJO", "SHAMISEN", "KOTO", "KALIMBA", "BAG PIPE", "FIDDLE", "SHANAI", "TINKLE BELL", "AGOGO", "STEEL DRUMS", "WOODBLOCK", "TAIKO DRUM", "MELODIC TOM", "SYNTH DRUM", "REVERSE CYMBAL", "GUITAR FRET NOISE", "BREATH NOISE", "SEASHORE", "BIRD TWEET", "TELEPHONE RING", "HELICOPTER", "APPLAUSE", "GUNSHOT"]
    
    # () => Unit
    clearAll = () -> clear()

    # () => List
    drums = () -> allDrums
  
    # () => List
    instruments = () -> allInstruments
  
    # (String) => Unit
    use = (instrument) ->
      instrumentIndex = instrument
      # Drum is special here
      if typeof instrument is 'string'
        if instrument.toUpperCase() is 'DRUM'
          instrumentIndex = 128
        else
          instrumentIndex = allInstruments.indexOf(instrument.toUpperCase())
      # Check availability
      if instrumentIndex >= 128 or instrumentIndex < 0
        throw new Error("Instrument #{instrument} is not available!")
      else if MIDI = getMIDI()
        if MIDI.Instrument isnt instrumentIndex
          MIDI.Play(false)
          MIDI.Instrument = instrumentIndex
      else
        workspace.printPrims.print("Switch to instrument #{instrument}")
      return

    # (Number) => Unit
    tempo = (speed) ->
      # Check availability
      if speed >= 1000 or speed <= 0
        throw new Error("Tempo #{speed} is too large or too small.")
      else if MIDI = getMIDI()
        MIDI.Tempo = speed
      else
        workspace.printPrims.print("Change tempo to #{speed}")
    
    # (Number, Number, Number) => Unit
    note = (note, beats, velocity) ->
      beats = 1 if not beats?
      velocity = 100 if not velocity?
      if beats > 100 or beats < 0
        throw new Error("Beats #{beats} is too large or too small.")
      if velocity >= 128 or velocity < 0
        throw new Error("Velocity #{velocity} is too large or too small.")
      else if MIDI = getMIDI()
        duration = beatsToMilliseconds(beats)
        MIDI.PlayNote(MIDI.Instrument, note, velocity * MIDI.Volume, duration, MIDI.Position)
        MIDI.ChangePosition(duration)
      else
        workspace.printPrims.print("Play note #{note} with #{beats} beats and #{velocity} velocity.")
      return

    # (Number) => Unit
    rest = (beats) ->
      if beats > 100 or beats < 0
        throw new Error("Beats #{beats} is too large or too small.")
      else if MIDI = getMIDI()
        MIDI.ChangePosition(beatsToMilliseconds(beats))
      else
        workspace.printPrims.print("Rest for #{beats}.")
      return
    
    # (Number) => Unit
    playLoop = (callback) ->
      if MIDI = getMIDI()
        if not callback? or typeof(callback) is 'string' or typeof(callback) is 'function'
          MIDI.Play(true, callback)
        else
          throw new Error("Callback should be the name of a procedure, or an anonymous procedure")
      else
        workspace.printPrims.print("Play the series indefinitely.")
    
    # (Number) => Unit
    playOnce = (callback) ->
      if MIDI = getMIDI()
        if not callback? or typeof(callback) is 'string' or typeof(callback) is 'function'
          MIDI.Play(false, callback)
        else
          throw new Error("Callback should be the name of a procedure, or an anonymous procedure")
      else
        workspace.printPrims.print("Play the series only once.")
    
    # () => Number
    who = () ->
      # Check availability
      if MIDI = getMIDI()
        MIDI.Who()
      else
        0

    # (Number) => Unit
    volume = (volume) ->
      # Check availability
      if volume > 1 or volume < 0
        throw new Error("Volume #{volume} is too large or too small.")
      else if MIDI = getMIDI()
        MIDI.Volume = volume
      else
        workspace.printPrims.print("Change volume to #{volume}")
    
    # (Number) => Unit
    moveTo = (beats) ->
      # Check availability
      if beats < 0
        throw new Error("Beats #{volume} is too small.")
      else if MIDI = getMIDI()
        MIDI.SetPosition(beatsToMilliseconds(beats))
      else
        workspace.printPrims.print("Move position to #{beats}")
        
    # (Number) => Unit
    rewind = (beats) ->
      # Check availability
      if beats > 100 or beats < 0
        throw new Error("Beats #{volume} is too large or too small.")
      else if MIDI = getMIDI()
        MIDI.ChangePosition(beatsToMilliseconds(beats))
      else
        workspace.printPrims.print("Move position back by #{beats}")

    # (Number) => Unit
    forward = (beats) ->
      # Check availability
      if beats > 100 or beats < 0
        throw new Error("Beats #{volume} is too large or too small.")
      else if MIDI = getMIDI()
        MIDI.ChangePosition(beatsToMilliseconds(beats))
      else
        workspace.printPrims.print("Move position forward by #{beats}")

    # (Number) -> Number
    beatsToMilliseconds = (beats) -> 60000 / MIDI.Tempo * beats
      
    # () => Unit
    clear = () ->
      if MIDI = getMIDI()
        MIDI.Clear()
      else
        workspace.printPrims.print("Stop all notes.")

    # (Number) => Unit
    stop = (who) ->
      if MIDI = getMIDI()
        MIDI.StopSeries(who)
      else
        workspace.printPrims.print("Stop tune series #{who}")
      return
    
    {
      name: "tune",
      clearAll: clearAll,
      prims: {
        "DRUMS": drums,
        "INSTRUMENTS": instruments,
        "USE": use,
        "TEMPO": tempo,
        "NOTE": note,
        "REST": rest,
        "LOOP": playLoop,
        "ONCE": playOnce,
        "WHO": who,
        "VOLUME": volume,
        "MOVETO": moveTo,
        "REWIND": rewind,
        "FORWARD": forward,
        "CLEAR": clear,
        "STOP": stop,
      }
    }
}
