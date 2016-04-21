'use strict';

/**
 * Note
 * Display a single note
 * @param {note}    note        The note to render
 * @param {Number}  noteMargin  The margin of the note
 *
 */

angular.module('allegroApp')
  .directive('note', function (noteValues, input, midi, appConfig) {
    return {
      templateUrl: 'components/directives/score-components/note/note.html',
      restrict: 'EA',
      scope: {
        note: '=',
        index: '=',
        noteMargin: '@'
      },
      link: function (scope, element, attrs) {

        scope.spacing = appConfig.scoreSpacing;
        scope.baseNote = null;
        attrs.isActive = false;
        scope.isUnclear = scope.note.unclear || false;

        /**
         * Check if the unclear state changes and apply changes to local var
         */
        scope.$watch(() => scope.note.unclear, () => {
          scope.isUnclear = scope.note.unclear;
        });

        /**
         * Get the horizontal offset of the note
         * noteWidth(40) + margin * index
         * @param  {Number} index The index of the note
         * @return {Number}       The calculated offset
         */
        scope.getXOffset = (index) => {
          return (40 + parseInt(scope.noteMargin)) * parseInt(index);
        };

        /**
         * Sets the selected note as active and plays the note
         */
        scope.setNoteAsActive = () => {
          if (!input.measureMode) {
            input.deactivateNote();
            input.activeNote = scope.note;
            input.currentInput = scope.note;

            if (scope.baseNote && !scope.note.rest) {
              midi.play(scope.baseNote);
            }
            scope.isActive = true;
          }
        };
        /**
         * Sets the current note as inactive
         */
        scope.setNoteAsInactive = () => {
            input.deactivateNote(scope.note);
            scope.isActive = false;

        };
        /**
         * Change the new base note
         * Base notes are needed to calculate the new note while dragging
         */
        scope.onDragEnd = () => {
          scope.baseNote = {pitch : scope.note.pitch};
        };

        /**
         * Calculate the offset and clip to each new note
         * If no base note is set, a new base note is initialized on drag start
         * Each time the offset clips to a new note, the note is played and displayed
         * @param  {Object} Event holding the drag event data
         */
        scope.onNoteDragged = (event) => {
          if (!scope.baseNote) {
            scope.baseNote = {pitch : scope.note.pitch};
          }
          let currentOffset = event.dragY * 2 / scope.spacing;
          let oldOffset = null;
          if (currentOffset % 1 === 0) {
            if (currentOffset !== oldOffset) {
              scope.note.pitch = noteValues.getNoteByDelta(scope.baseNote, currentOffset);
              oldOffset = currentOffset;
              scope.$apply();
              midi.play(scope.note);
            }
          }
        };

        /**
         * Returns the vertical offset of a note
         * @param  {Number} step    The step of the note pitch
         * @param  {Number} octave  The octave of the note pitch
         * @return {Number}         The offset in pixels
         */
        scope.getYOffset = (step, octave) => {
          const notes = ['C','D','E','F','G','A','B'];
          const baseOctave = 4;
          const baseLine = 2.2 * scope.spacing;
          let offset =
            baseLine -
            3.5 * scope.spacing * (parseInt(octave) -  baseOctave) -
            0.5 * scope.spacing * notes.indexOf(step);
          return offset;
        };

      }
    };
  });
