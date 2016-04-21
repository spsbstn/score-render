'use strict';

/**
 * Note Input
 * Display the note input
 * @param {Number}  indexOfNote The index of the input note
 * @param {Number}  noteMargin  The margin of the note
 */

angular.module('allegroApp')
  .directive('noteInput', function (score, input, history, noteValues, midiInput, appConfig) {
    return {
      templateUrl: 'components/directives/score-components/note-input/note-input.html',
      restrict: 'EA',
      scope: {
        indexOfNote: '@',
        noteMargin: '@',
      },
      link: function (scope) {

        scope.input = input;
        scope.isMeasureMode = () => input.measureMode;
        scope.lastIndex = 7;
        scope.spacing = appConfig.scoreSpacing;

        /**
         * Current note, default value is C5
         * @type {Object}
         */
        scope.currentNote = {pitch: noteValues.notes[7]};

        /**
         * Check if the index changed on hover
         * If true, update the current note
         * @param  {Number} index Index of the note hovered over
         */
        scope.updateHoverIndex = (index) => {
          if(scope.lastIndex !== index) {
            scope.currentNote = {pitch:noteValues.notes[index]};
            scope.lastIndex = index;
          }
        };

        /**
         * Returns the horizontal offset of the note
         * @return {Number} Horizontal offset
         */
        scope.getXOffset = () =>
          (40 + parseInt(scope.noteMargin)) * (parseInt(scope.indexOfNote)-0.5);

        /**
         * Returns the vertical offset of a note
         * @param  {Number} index Index of the note hovered over
         * @return {Number}       Vertical Offset
         */
        scope.getYOffset = (index) =>
          parseInt(index) * 0.5 * parseInt(scope.spacing);

        /**
         * Adds an rest (note value of C5)
         * Saves state in history service
         */
        scope.addRest = () => {
          history.save();
          score.addNote(Object.assign({}, input.currentInput), 7);
        };

        /**
         * Add note
         * Saves state in history service
         * @param  {Number} index Index of the note hovered over
         */
        scope.addNote = (index) => {
          history.save();
          score.addNote(Object.assign({}, input.currentInput), index);
        };

        /**
         * Callback to add note via a Midi Device
         * @param  {[Number} note Midi Pitch (55-84)
         */
        midiInput.onNote((note) => {
          // check if note is in range
          if(note >= 55 && note <= 84) {
            history.save();
            score.addNoteByMidiPitch(Object.assign({}, input.currentInput), note);
            scope.$apply();
          }
        });
      }
    };
  });
