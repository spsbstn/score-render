'use strict';

(function() {
  /**
   * Initial index of the fifths array
   * Leads to an alter value of 0
   * @type {Number}
   */
  let fifths = 6;

  /**
   * Note presets
   * 'alter' value is a getter dependend on fifths
   * @type {Array}
   */
  const notes = [
    {
      'step': 'C',
      'octave': 6,
      'alter': 0
    },
    {
      'step': 'B',
      'octave': 5,
      'alter': 0
    },
    {
      'step': 'A',
      'octave': 5,
      'alter': 0
    },
    {
      'step': 'G',
      'octave': 5,
      get alter() {
        return [0,0,0,0,0,0,0,0,0,1,1,1,1][fifths];
      }
    },
    {
      'step': 'F',
      'octave': 5,
      get alter() {
        return [0,0,0,0,0,0,0,1,1,1,1,1,1][fifths];
      }
    },
    {
      'step': 'E',
      'octave': 5,
      get alter() {
        return [-1,-1,-1,-1,-1,0,0,0,0,0,0,0,1][fifths];
      }
    },
    {
      'step': 'D',
      'octave': 5,
      get alter() {
        return [-1,-1,-1,0,0,0,0,0,0,0,1,1,1][fifths];
      }
    },
    {
      'step': 'C',
      'octave': 5,
      get alter() {
        return [-1,0,0,0,0,0,0,0,1,1,1,1,1][fifths];
      }
    },
    {
      'step': 'B',
      'octave': 4,
      get alter() {
        return [-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0][fifths];
      }
    },
    {
      'step': 'A',
      'octave': 4,
      get alter() {
        return [-1,-1,-1,-1,0,0,0,0,0,0,0,1,1][fifths];
      }
    },
    {
      'step': 'G',
      'octave': 4,
      get alter() {
        return [-1,-1,0,0,0,0,0,0,0,0,0,0,0][fifths];
      }
    },
    {
      'step': 'F',
      'octave': 4,
      'alter': 0
    },
    {
      'step': 'E',
      'octave': 4,
      'alter': 0
    },
    {
      'step': 'D',
      'octave': 4,
      'alter': 0
    },
    {
      'step': 'C',
      'octave': 4,
      'alter': 0
    },
    {
      'step': 'B',
      'octave': 3,
      'alter': 0
    },
    {
      'step': 'A',
      'octave': 3,
      'alter': 0
    },
    {
      'step': 'G',
      'octave': 3,
      'alter': 0
    }
  ];

  /**
   * Deep search an object
   *
   * @param  {Object} obj  The object to search
   * @param  {String} path The Path to search
   * @return {Obj | Boolean} Returns the object in the path or false
   */
  let deepSearch = (obj, path) => {
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    let a = path.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        let k = a[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            return false;
        }
    }
    return obj;
  };

  class NoteValues {

    get notes() {
      return notes;
    }

    /**
     * Sets fifths value
     * Calculates index from actual fifths value
     */
    set fifths(val) {
      fifths = 6 + val;
    }

    get fifths() {
      return fifths;
    }

    /**
     * Returns a note by a midi pitch
     * @param  {Number} pitch Midipitch
     * @return {Object}       Note Object
     */
    getNoteByMidiPitch(pitch) {
      let midiLetterPitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'B#'];
      let octave = parseInt(pitch / 12, 10) - 1;
      let remainder = (pitch % 12);
      let step = midiLetterPitches[remainder];
      let alter = 0;
      if (step.length > 1) {
        alter = step[1] === '#' ? 1 : -1;
        step = step[0];
      }

      return {
          'step': step,
          'octave': octave,
          'alter': alter
        };
    }

    /**
     * Find note in noteValues
     * @param  {Object} noteToFind The note to find
     * @return {NUmber}            The index of the note or null
     */
    findNote(noteToFind) {
      let index = null;
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].step === noteToFind.pitch.step &&
            notes[i].octave === noteToFind.pitch.octave) {
              index = i;
        }
      }
      return index;
    }

    getNextHigherNote(note) {
      return notes[this.findNote(note) - 1];
    }

    getNextLowerNote(note) {
      return notes[this.findNote(note) + 1];
    }

    /**
     * Expose deep search function
     * @param  {Object} note     The note object to search
     * @param  {Object} ...props The props to search for
     * @return {Boolean}         Returns true if the props exist
     */
    checkForProps(note, ...props) {
      let result = true;
      for (let prop of props) {
        if(deepSearch(note, prop.path) !== prop.value) {
          result = false;
        }
      }
      return result;
    }

    /**
     * Get notes by a delta
     * @param  {Object} note  The base note
     * @param  {Number} delta The delta from the note
     * @return {Object}       Matching note
     */
    getNoteByDelta(note, delta) {
      let index = this.findNote(note);
      let newIndex = index + delta;

      if (newIndex >= notes.length) {
        newIndex = notes.length-1;
      }

      if (newIndex < 0) {
        newIndex = 0;
      }
      return notes[newIndex];
    }

    /**
     * Compares two notes
     * @param  {Object} note1 Note1
     * @param  {Object} note2 Note2
     * @return {Number}       Delta of the two notes
     */
    compareNotes(note1, note2) {
      let index1 = this.findNote(note1);
      let index2 = this.findNote(note2);
      return index1 - index2;
    }
  }
angular.module('allegroApp')
      .service('noteValues', NoteValues);
})();
