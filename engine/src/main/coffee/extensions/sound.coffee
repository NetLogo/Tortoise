tone = require('tone')

module.exports = {


  init: (workspace) ->

    synth = new tone.PolySynth(tone.Synth).toDestination()

    playNote = (note, duration, velocity) ->
      regex = /(A|B|C|D|E|F|G)#?\d/
      if regex.test(note)
        synth.triggerAttackRelease(note, duration, undefined, velocity)
      else
        throw new Error("Extension exception: " + note + " is not a valid note!")
    {
      name: "sound",
      prims: {
        "PLAY-NOTE": playNote
      }
    }

}
