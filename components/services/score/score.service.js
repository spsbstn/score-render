'use strict';

/**
 * 	Score Service
 */


(function() {
  /**
   * 	The actual score object
   *  Contains all data needed to render the score
   */
  let score;
  /**
   * Array of score-change-listeners
   * All of them get triggered if the score changed
   * @type {Array}
   */
  let scoreChangedListeners = [];

  /**
   * Callback to trigger, once the score changed (private)
   */
  let _scoreChanged = () => {
    for (let listener of scoreChangedListeners) {
      listener();
    }
  };

class Score {

  constructor(noteValues, input, toasty, $http, midi) {
    this.noteValues = noteValues;
    this.input = input;
    this.$http = $http;
    this.midi = midi;
    this.toasty = toasty;
    this.sheetImageUrl = '';
    this.measures = [{image: ''}];

    // set the score to basic template
    score = {
      'attributes': {
        'divisions': 4,
        'clef': { 'sign': 'G', 'line': 2 },
        'key': {'fifths': 0 },
        'time' : {'beats': 3, 'beat-type': 4}
      },
      'measures': [
        {
          'attributes': {
            repeat: {
              left: false,
              right: false
            }
          },
          notes: [
            {
              'type': 'input'
            }
          ]
        }
      ]
    };
  }

  /**
   * Submits the score to the server
   * @param  {Array} measures Measure-Image-Array
   */
  submit(measures) {
    // remove input note
    let lastMeasure = score.measures[score.measures.length -1];
    if (lastMeasure.notes.length > 1) {
      lastMeasure.notes.pop();
    } else {
      score.measures.pop();
    }
    // push to server
    return this.$http.post('/api/transcriptions', {
      score: score,
      measures: measures,
      // only push the file name, not the full path
      fileName: this.sheetImageUrl.replace(/^.*[\\\/]/, '')
    });
  }

  /**
   * Add a new note at the end of the score
   * @param {Object} newNote The note object for the new note
   * @param {Number} index   Index of the pitch for the new note
   */
  addNote(newNote, index) {
    if (typeof index !== 'undefined') {
      newNote.pitch = this.noteValues.notes[index];
    }
      let measures = this.score.measures;
      let notes = measures[measures.length-1].notes;
      if (!newNote.rest) {
        this.midi.play(newNote);
      }
      notes.splice(notes.length - 1, 0, angular.copy(newNote)).join();
  }

  /**
   * Add a new note at the end of the score
   * @param {Object} newNote The note object for the new note
   * @param {Number} pitch   Midi pitch
   */
  addNoteByMidiPitch(newNote, pitch) {
    if (typeof pitch !== 'undefined') {
      newNote.pitch = this.noteValues.getNoteByMidiPitch(pitch);
    }
      let measures = this.score.measures;
      let notes = measures[measures.length-1].notes;
      if (!newNote.rest) {
        this.midi.play(newNote);
      }
      notes.splice(notes.length - 1, 0, angular.copy(newNote)).join();
  }

  /**
   * Adds a new empty measure at the end of the score
  */
  newMeasure() {
    let measures = this.score.measures;
    if(measures[measures.length-1].notes.length > 1) {
      measures[measures.length-1].notes.pop();
      measures.push(
        {
          'attributes': {
            repeat: {
              left: false,
              right: false
            }
          },
          'notes':[
            {'type' : 'input'}
          ]
        });
    }
  }

  /**
   * Adds a new note before or after a note
   * @param {Object} note     The note to insert the new note before/after
   * @param {String} position 'AFTER' or 'BEFORE', default is 'AFTER'
   */
  addNoteAtPosition(note, position = 'AFTER') {

    let offset = position === 'BEFORE' ? 0 : 1;

    // default note
    let newNote = {
      'type': 'quarter',
      'pitch': this.noteValues.notes[9],
      'rest': false,
      'dotted': false
    };

    for(let measure of this.score.measures) {
      let index = measure.notes.indexOf(note);
      if(index !== -1) {
        measure.notes.splice(index + offset, 0 , angular.copy(newNote));
        return;
      } else {
        console.error('Could not find active note (addNoteAtPosition:score.service.js)');
      }
    }
  }

  /**
   * Plays the whole song
   */
  playAll() {
    this.midi.playMeasures(score.measures);
  }

  /**
   * Resets all variables
   */
  resetScore() {
    this.measures = [{image: ''}];
    score = {
      'attributes': {
        'divisions': 4,
        'clef': { 'sign': 'G', 'line': 2 },
        'key': {'fifths': 0 },
        'time' : {'beats': 3, 'beat-type': 4}
      },
      'measures': [
        {
          'attributes': {
            repeat: {
              left: false,
              right: false
            }
          },
          notes: [
            {
              'type': 'input'
            }
          ]
        }
      ]
    };
  }

  /**
   * Removes a note
   * @param  {Object} note The note to remove
   */
  removeNote(note) {
    for(let measure of this.score.measures) {
        let index = measure.notes.indexOf(note);
        if(index !== -1) {
          measure.notes.splice(index, 1);
          return;
        }
    }
    console.error('Could not find note to remove (removeNote:score.service.js)');
  }

  /**
   * Sets the score key and the note value index
   * @param {Number} fifths Fifths Number
   */
  setKey(fifths) {
    let key =  {
      'fifths': fifths
    };
    this.noteValues.fifths = fifths * 1;
    this.score.attributes.key = key;
  }

  /**
   * Sets the score, triggers score changed
   */
  set score(newScore) {
    score = newScore;
    _scoreChanged();
  }

  /**
   * Add Callback functions to scoreChanged
   * @param  {Function} fn Function to trigger

   */
  onScoreChanged(fn) {
    scoreChangedListeners.push(fn);
  }

  get score() {
    return score;
  }

  /**
   * Toggle the repeat type
   * @param  {Object} measure The measure to change
   * @param  {String} type    'left' or 'right', the side of the repeat
   */
  switchBartype(measure, type) {
    measure.attributes.repeat[type] = !measure.attributes.repeat[type];
  }

  get time() {
    return this.score.attributes.time.beats + '' + this.score.attributes.time['beat-type'];
  }

  get key() {
    return this.score.attributes.key.fifths;
  }

  /**
   * Sets the time of the score
   * @param {Number} beats    Top part of the time signature, 3 for 3/4
   * @param {Number} beatType Bottom part of the time signature, 4 for 3/4
   */
  setTime(beats, beatType) {
    let time = {
      'beats': beats,
      'beat-type': beatType
    };
    this.score.attributes.time = time;
  }
}

angular.module('allegroApp')
  .service('score', Score);
})();
