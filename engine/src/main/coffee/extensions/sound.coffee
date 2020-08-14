tone             = require('tone')

module.exports = {


  init: (workspace) ->

    playNote = (note, duration, velocity) ->
      regex = /(A|B|C|D|E|F|G)#?\d/
      if regex.test(note)
        synth = new tone.Synth().toDestination()
        synth.triggerAttackRelease(note, duration, undefined, velocity)
    {
      name: "sound"
    , prims: {
        "PLAY-NOTE": playNote
      }
    }

}
