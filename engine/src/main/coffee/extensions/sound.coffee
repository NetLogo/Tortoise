module.exports = {
  init: (workspace) ->
    synth = null
    setup = () ->
      tone = require('tone')
      synth = new tone.PolySynth(tone.Synth).toDestination()
    playTone = (note, duration, velocity) ->
      if synth is null then setup()
      regex = /(A|B|C|D|E|F|G)(#|b)?\d/
      if regex.test(note)
        synth.triggerAttackRelease(note, duration, undefined, velocity)
      else
        throw new Error("Extension exception: " + note + " is not a valid note!")
    {
      name: "sound",
      prims: {
        "PLAY-TONE": playTone
      }
    }
}
