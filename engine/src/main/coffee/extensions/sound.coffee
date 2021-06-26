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

    # () => List
    drums = () -> allDrums
  
    # () => List
    instruments = () -> allInstruments
  
    # (String, Number) => Unit
    playDrum = (drum, velocity) ->
      drumIndex = allDrums.indexOf(drum.toUpperCase())
      if drumIndex is -1
        throw new Error("Drum #{drum} is not available!")
      else
        if MIDI = getMIDI()
          MIDI.PlayDrum(drumIndex, velocity)
        else
          workspace.printPrims.print("Play drum #{drum} at velocity #{velocity}")
      return

    # (String, Number, Number, Number) => Unit
    playNote = (instrument, note, velocity, duration) ->
      instrumentIndex = allInstruments.indexOf(instrument.toUpperCase())
      if instrumentIndex is -1
        throw new Error("Instrument #{instrument} is not available!")
      else
        if MIDI = getMIDI()
          MIDI.PlayNote(instrumentIndex, note, velocity, duration * 1000, 0)
        else
          workspace.printPrims.print("Play note #{note} at velocity #{velocity} with instrument #{instrument} and duration #{duration}s")
      return
    
    # (Number, String, Number, Number, Number) => Unit
    playNoteLater = (delay, instrument, note, velocity, duration) ->
      instrumentIndex = allInstruments.indexOf(instrument.toUpperCase())
      if instrumentIndex is -1
        throw new Error("Instrument #{instrument} is not available!")
      else
        if MIDI = getMIDI()
          MIDI.PlayNote(instrumentIndex, note, velocity, duration * 1000, delay * 1000)
        else
          workspace.printPrims.print("Play note #{note} at velocity #{velocity} with instrument #{instrument} and duration #{duration}s, delayed by #{delay}s")
      return

    # (String, Number, Number) => Unit
    startNote = (instrument, note, velocity) ->
      instrumentIndex = allInstruments.indexOf(instrument.toUpperCase())
      if instrumentIndex is -1
        throw new Error("Instrument #{instrument} is not available!")
      else
        if MIDI = getMIDI()
          MIDI.PlayNote(instrumentIndex, note, velocity, -1, 0)
        else
          workspace.printPrims.print("Start note #{note} at velocity #{velocity} with instrument #{instrument}")
      return
      
    # (String, Number) => Unit
    stopInstrument = (instrument) ->
      instrumentIndex = allInstruments.indexOf(instrument.toUpperCase())
      if instrumentIndex is -1
        throw new Error("Instrument #{instrument} is not available!")
      else
        if MIDI = getMIDI()
          MIDI.StopInstrument(instrument)
        else
          workspace.printPrims.print("Stop all notes with instrument #{instrument}")
      return

    # (String, Number) => Unit
    stopNote = (instrument, note) ->
      instrumentIndex = allInstruments.indexOf(instrument.toUpperCase())
      if instrumentIndex is -1
        throw new Error("Instrument #{instrument} is not available!")
      else
        if MIDI = getMIDI()
          MIDI.StopNote(instrumentIndex, note)
        else
          workspace.printPrims.print("Stop note #{note} with instrument #{instrument}")
      return

    # () => Unit
    stopMusic = () ->
      if MIDI = getMIDI()
        MIDI.Clear()
      else
        workspace.printPrims.print("Stop all notes.")
    
    {
      name: "sound",
      prims: {
        "DRUMS": drums,
        "INSTRUMENTS": instruments,
        "PLAY-DRUM": playDrum,
        "PLAY-NOTE": playNote,
        "PLAY-NOTE-LATER": playNoteLater,
        "START-NOTE": startNote,
        "STOP-NOTE": stopNote,
        "STOP-INSTRUMENT": stopInstrument,
        "STOP-MUSIC": stopMusic
      }
    }
}
