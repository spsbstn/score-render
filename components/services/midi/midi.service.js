'use strict';

/**
 * 	Service handling all things midi
 */

 /**
  * Import jsmidgen(https://github.com/dingram/jsmidgen) as Midgen
  * So the Midi-Class is not shadowed
  * @type {Object}
  */
 let Midgen = Midi;

(function() {

  /**
   * Ready-Promise, resolved when Midi.js Plugin is loaded
   * @param {Promise}
   */
  let ready = new Promise((resolve) => {
    MIDI.loadPlugin({
    soundfontUrl: 'assets/soundfonts/',
    instrument: 'acoustic_grand_piano',
    onsuccess: function() {
        resolve();
      }
    });
  });

  /**
   * Mute state of the app
   * @type {Boolean}
   */
  let muted = false;

  /**
   * Object containing the midi-pitches for each letter
   * @type {Object}
   */
  let midiLetterPitches =  { a:21, b:23, c:12, d:14, e:16, f:17, g:19 };

  /**
   * Converts a Note String to a midi-pitch
   * @param  {String} n NoteText eg. 'C5#''
   * @return {Number}   Midi-pitch
   */
  let midiPitchFromNote = (n) => {
  	let matches = /([a-g])(#+|b+)?([0-9]+)$/i.exec(n);
  	let note = matches[1].toLowerCase();
    let accidental = matches[2] || '';
    let octave = parseInt(matches[3], 10);
  	return (12 * octave) + midiLetterPitches[note] + (accidental.substr(0,1)==='#'?1:-1) * accidental.length;
  };

  class Midi {

    set muted(val) {
        muted = val;
    }

    get muted() {
      return muted;
    }

    get playing() {
      return MIDI.Player.playing;
    }

    /**
     * Plays an array of measures
     * @param  {Array} measures Array of measures to play
     */
    playMeasures(measures) {
      ready.then(() => {
        let file = new Midgen.File();
        let track = new Midgen.Track();
        let player = MIDI.Player;
        MIDI.Player.addListener((data) => {
          let now = data.now;
          let end = data.end;
          if (end === now) {
            MIDI.Player.stop();
          }
        });
        file.addTrack(track);
        let delay = 0;

        for (let measure of measures) {
          for (let note of measure.notes) {
            if(note.type !== 'input') {
              let alter = '';
              let duration = note.duration * 32;
              if (note.pitch.alter !== 0) {
                alter = note.pitch.alter === -1 ? 'b' : '#';
              }
              if (note.dot) {
                duration = duration * 1.5;
              }
              if (note.rest) {
                // add a delay to the next note, rest
                delay = note.duration * 32;
              } else {
                // add fake second note, because midijs skips second note, duh
                if(track.events.length === 2) {
                  track.addNote(0, note.pitch.step + alter + (note.pitch.octave - 1), duration, delay);
                }
                track.addNote(0, note.pitch.step + alter + (note.pitch.octave - 1), duration, delay);
                delay = 0;
              }
            }
          }
        }
        let dataUri = 'data:audio/mid;base64,' + btoa(file.toBytes());
        player.timeWarp = 1;
        player.loadFile(dataUri, player.start);
      });
    }

    stop() {
      MIDI.Player.stop();
    }

    /**
     * Generate and trigger the download of a midi file containing the given
     * measures
     * @param  {Array} measures Array of measurs to save
     */
    download(measures) {
      ready.then(() => {
        let file = new Midgen.File();
        let track = new Midgen.Track();
        file.addTrack(track);
        let delay = 0;

        for (let measure of measures) {
          for (let note of measure.notes) {
            if(note.type !== 'input') {
              let alter = '';
              let duration = note.duration * 32;
              if (note.pitch.alter !== 0) {
                alter = note.pitch.alter === -1 ? 'b' : '#';
              }
              if (note.dot) {
                duration = duration * 1.5;
              }
              if (note.rest) {
                // add a delay to the next note, rest
                delay = note.duration * 32;
              } else {
                track.addNote(0, note.pitch.step + alter + (note.pitch.octave - 1), duration, delay);
                delay = 0;
              }
            }
          }
        }
        saveAs( new Blob([ new Uint8Array([].map.call(file.toBytes(), function(c) { return c.charCodeAt(0); })).buffer], {type: 'application/x-midi'}) , 'song.mid' );
      });

    }

    /**
     * Plays the passed note, note has to be in musicjson notation
     * @param  {Object} note The note to play
     */
    play(note) {
      ready.then(() => {
        if(!muted) {
          let alter = '';
          if (note.pitch.alter !== 0) {
            alter = note.pitch.alter === -1 ? 'b' : '#';
          }
          let delay = 0;
          let velocity = 127;
          MIDI.setVolume(0, 100);
          MIDI.noteOn(0, midiPitchFromNote(note.pitch.step + alter + (parseInt(note.pitch.octave)-1)), velocity, delay);
          MIDI.noteOff(0, note, delay + 0.75);
        }
      });
  	}
  }
  angular.module('allegroApp')
    .service('midi', Midi);
})();
